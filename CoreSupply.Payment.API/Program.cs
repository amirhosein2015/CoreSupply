using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.BuildingBlocks.Observability;
using CoreSupply.Payment.API.Consumers;
using MassTransit;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. Observability (New Feature) ---
// فعال‌سازی OpenTelemetry برای مانیتورینگ
builder.AddCustomOpenTelemetry();

// --- تنظیمات MassTransit ---
builder.Services.AddMassTransit(config =>
{
    config.AddConsumer<ProcessPaymentConsumer>();

    config.UsingRabbitMq((ctx, cfg) =>
    {
        var rabbitMqHost = builder.Configuration["EventBusSettings:HostAddress"] ?? "amqp://guest:guest@core.eventbus:5672";
        cfg.Host(rabbitMqHost);

        cfg.ReceiveEndpoint("payment-processing-queue", c =>
        {
            c.ConfigureConsumer<ProcessPaymentConsumer>(ctx);
        });
    });
});
// ---------------------------

var app = builder.Build();
app.MapControllers();
app.Run();
