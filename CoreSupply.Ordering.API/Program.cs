using CoreSupply.Ordering.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MassTransit;
using CoreSupply.Ordering.API.EventBusConsumer;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.BuildingBlocks.Observability; // [New] Namespace for OTEL
using CoreSupply.BuildingBlocks.Behaviors;
using Polly;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CoreSupply.Ordering.API.Sagas;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. Observability (New Feature) ---
// فعال‌سازی OpenTelemetry برای مانیتورینگ
builder.AddCustomOpenTelemetry();

// --- 3. API Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// --- تنظیمات Swagger ---
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Ordering API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.\r\nExample: \"Bearer 12345abcdef\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// --- 4. Database with Polly Retry ---
builder.Services.AddDbContext<OrderContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("OrderingConnectionString"),
        sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 10,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }
    ));

// --- 5. MediatR ---
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
});

// --- 6. MassTransit with Saga ---
builder.Services.AddMassTransit(config =>
{
    config.AddConsumer<BasketCheckoutConsumer>();

    config.AddSagaStateMachine<OrderStateMachine, OrderState>()
        .EntityFrameworkRepository(r =>
        {
            r.ExistingDbContext<OrderContext>();
            r.UseSqlServer();
        });

    config.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host("amqp://guest:guest@core.eventbus:5672");

        cfg.ReceiveEndpoint("basket-checkout-queue", c =>
        {
            c.ConfigureConsumer<BasketCheckoutConsumer>(ctx);
        });

        cfg.ReceiveEndpoint("order-saga", e =>
        {
            const int concurrencyLimit = 10;
            e.PrefetchCount = concurrencyLimit;
            e.UseMessageRetry(r => r.Interval(5, 1000));
            e.ConfigureSaga<OrderState>(ctx);
        });
    });
});

// --- 7. HttpClient ---
builder.Services.AddHttpClient("CatalogClient", client =>
{
    client.BaseAddress = new Uri("http://catalog.api:8080");
})
.AddTransientHttpErrorPolicy(p => p.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));

// --- 8. Authentication ---
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Encoding.ASCII.GetBytes(jwtSettings.GetValue<string>("Secret")!);

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(secretKey),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
            ValidateAudience = true,
            ValidAudience = jwtSettings.GetValue<string>("Audience"),
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

// --- Pipeline ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<OrderContext>();
        context.Database.EnsureCreated();

        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Database and Saga tables ensured successfully.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while creating the database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program { }
