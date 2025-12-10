using CoreSupply.Quote.API.Repositories;
using MassTransit;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.Quote.API.Services;
using CoreSupply.Discount.Grpc.Protos;
using CoreSupply.BuildingBlocks.Observability;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. Observability (New Feature) ---
// فعال‌سازی OpenTelemetry برای مانیتورینگ
builder.AddCustomOpenTelemetry();

// --- Add services to the container ---

// 1. Redis Configuration
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetValue<string>("CacheSettings:ConnectionString");
});

// 2. gRPC Client Configuration (حیاتی برای ارتباط با Discount)
builder.Services.AddGrpcClient<DiscountProtoService.DiscountProtoServiceClient>(o =>
{
    // تلاش برای خواندن از کانفیگ داکر (GrpcSettings__DiscountUrl)
    var address = builder.Configuration["GrpcSettings:DiscountUrl"];

    // فال‌بک برای اجرای لوکال
    o.Address = new Uri(address ?? "http://localhost:9005");
});

// [CRITICAL FIX] ثبت کلاس Wrapper که در Repository استفاده کردیم
builder.Services.AddScoped<DiscountGrpcService>();

// 3. Repositories
builder.Services.AddScoped<IBasketRepository, BasketRepository>();

// 4. MassTransit Configuration
builder.Services.AddMassTransit(config => {
    config.UsingRabbitMq((ctx, cfg) => {
        // اتصال به RabbitMQ (می‌توانید این را هم از کانفیگ بخوانید)
        cfg.Host("amqp://guest:guest@core.eventbus:5672");
    });
});

// 5. API Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- Pipeline ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();

