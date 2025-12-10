using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.BuildingBlocks.Observability;
using CoreSupply.Inventory.Grpc.Consumers;
using MassTransit;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddGrpc();

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. Observability (New Feature) ---
// فعال‌سازی OpenTelemetry برای مانیتورینگ
builder.AddCustomOpenTelemetry();

// --- تنظیمات MassTransit (جدید) ---
builder.Services.AddMassTransit(config =>
{
    // ثبت Consumer
    config.AddConsumer<ReserveStockConsumer>();

    config.UsingRabbitMq((ctx, cfg) =>
    {
        // آدرس RabbitMQ از تنظیمات خوانده می‌شود
        var rabbitMqHost = builder.Configuration["EventBusSettings:HostAddress"] ?? "amqp://guest:guest@core.eventbus:5672";
        cfg.Host(rabbitMqHost);

        // تعریف صف اختصاصی برای این سرویس
        cfg.ReceiveEndpoint("inventory-stock-queue", c =>
        {
            c.ConfigureConsumer<ReserveStockConsumer>(ctx);
        });
    });
});
// ----------------------------------

var app = builder.Build();

app.MapGrpcService<CoreSupply.Inventory.Grpc.Services.GreeterService>(); // (اگر دارید)
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client.");

app.Run();
