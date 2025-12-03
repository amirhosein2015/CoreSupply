using CoreSupply.Ordering.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MassTransit;
using CoreSupply.Ordering.API.EventBusConsumer;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.BuildingBlocks.Behaviors; // برای پایپ‌لاین‌های MediatR
using Polly; // برای Circuit Breaker

var builder = WebApplication.CreateBuilder(args);

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. API Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 3. Database with Polly Retry (Resilience) ---
builder.Services.AddDbContext<OrderContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("OrderingConnectionString"),
        sqlOptions =>
        {
            // اگر دیتابیس قطع شد، تا 10 بار تلاش کن (هر بار با حداکثر 30 ثانیه تاخیر)
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 10,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }
    ));

// --- 4. MediatR with Pipelines (Validation & Logging) ---
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    // ثبت رفتارهای هوشمند (به ترتیب اجرا می‌شوند)
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
});

// --- 5. MassTransit (RabbitMQ) ---
builder.Services.AddMassTransit(config => {
    config.AddConsumer<BasketCheckoutConsumer>();

    config.UsingRabbitMq((ctx, cfg) => {
        cfg.Host("amqp://guest:guest@core.eventbus:5672");
        cfg.ReceiveEndpoint("basket-checkout-queue", c => {
            c.ConfigureConsumer<BasketCheckoutConsumer>(ctx);
        });
    });
});

// --- 6. HttpClient with Circuit Breaker (Polly) ---
// اگر سرویس کاتالوگ قطع بود، بعد از 5 خطا، مدار را قطع کن
builder.Services.AddHttpClient("CatalogClient", client =>
{
    client.BaseAddress = new Uri("http://catalog.api:8080");
})
.AddTransientHttpErrorPolicy(p =>
    p.CircuitBreakerAsync(5, TimeSpan.FromSeconds(30)));

var app = builder.Build();

// --- Pipeline ---

// مایگریشن خودکار
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

app.UseAuthorization();
app.MapControllers();

app.Run();
