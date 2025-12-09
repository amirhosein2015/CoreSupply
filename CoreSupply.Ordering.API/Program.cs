using CoreSupply.Ordering.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MassTransit;
using CoreSupply.Ordering.API.EventBusConsumer;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.BuildingBlocks.Behaviors;
using Polly;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CoreSupply.Ordering.API.Sagas;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. API Services ---
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

// --- 3. Database with Polly Retry ---
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

// --- 4. MediatR ---
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
});

// --- 5. MassTransit with Saga (UPDATED) ---
builder.Services.AddMassTransit(config =>
{
    // ثبت Consumer قدیمی (Checkout)
    config.AddConsumer<BasketCheckoutConsumer>();

    // [New] ثبت Saga State Machine
    config.AddSagaStateMachine<OrderStateMachine, OrderState>()
        .EntityFrameworkRepository(r =>
        {
            // استفاده از کانتکست موجود برای ذخیره وضعیت Saga
            r.ExistingDbContext<OrderContext>();
            r.UseSqlServer();
        });

    config.UsingRabbitMq((ctx, cfg) =>
    {
        cfg.Host("amqp://guest:guest@core.eventbus:5672");

        // تنظیم صف برای Consumer قدیمی
        cfg.ReceiveEndpoint("basket-checkout-queue", c =>
        {
            c.ConfigureConsumer<BasketCheckoutConsumer>(ctx);
        });

        // [New] تنظیم صف برای Saga
        cfg.ReceiveEndpoint("order-saga", e =>
        {
            const int concurrencyLimit = 10;
            e.PrefetchCount = concurrencyLimit;
            e.UseMessageRetry(r => r.Interval(5, 1000));
            e.ConfigureSaga<OrderState>(ctx);
        });
    });
});

// --- 6. HttpClient ---
builder.Services.AddHttpClient("CatalogClient", client =>
{
    client.BaseAddress = new Uri("http://catalog.api:8080");
})
.AddTransientHttpErrorPolicy(p => p.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));

// --- 7. Authentication ---
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

        // [CRITICAL FIX] استفاده از EnsureCreated به جای Migrate برای ساخت خودکار جداول Saga
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
