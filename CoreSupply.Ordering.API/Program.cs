using CoreSupply.Ordering.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MassTransit;
using CoreSupply.Ordering.API.EventBusConsumer;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.BuildingBlocks.Behaviors;
using Polly;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens; // اضافه شد
using System.Text; // اضافه شد

var builder = WebApplication.CreateBuilder(args);

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. API Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// --- تنظیمات Swagger با دکمه قفل (Authorize) ---
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Ordering API", Version = "v1" });

    // تعریف سیستم احراز هویت JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
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
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
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

// --- 5. MassTransit ---
builder.Services.AddMassTransit(config => {
    config.AddConsumer<BasketCheckoutConsumer>();
    config.UsingRabbitMq((ctx, cfg) => {
        cfg.Host("amqp://guest:guest@core.eventbus:5672");
        cfg.ReceiveEndpoint("basket-checkout-queue", c => {
            c.ConfigureConsumer<BasketCheckoutConsumer>(ctx);
        });
    });
});

// --- 6. HttpClient ---
builder.Services.AddHttpClient("CatalogClient", client =>
{
    client.BaseAddress = new Uri("http://catalog.api:8080");
})
.AddTransientHttpErrorPolicy(p =>
    p.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));

// --- 7. Authentication (اصلاح شده) ---
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
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication(); // حتما قبل از Authorization
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
