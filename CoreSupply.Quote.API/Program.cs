using CoreSupply.Quote.API.Repositories;
using MassTransit; // اضافه شد
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.Quote.API.Services;
using CoreSupply.Discount.Grpc.Protos;
using CoreSupply.Quote.API.Services;



var builder = WebApplication.CreateBuilder(args);
builder.AddCustomSerilog();



// --- Add services to the container ---

// 1. Redis Configuration
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetValue<string>("CacheSettings:ConnectionString");
});

// 2. Repositories
builder.Services.AddScoped<IBasketRepository, BasketRepository>();

// 3. MassTransit Configuration (اضافه شده برای ارسال پیام)
builder.Services.AddMassTransit(config => {
    config.UsingRabbitMq((ctx, cfg) => {
        // اتصال به RabbitMQ داکر
        cfg.Host("amqp://guest:guest@core.eventbus:5672");
    });
});

// تنظیم آدرس سرویس gRPC (نام کانتینر + پورت 8080)
builder.Services.AddGrpcClient<DiscountProtoService.DiscountProtoServiceClient>(o =>
    o.Address = new Uri("http://discount.grpc:8080"));

builder.Services.AddScoped<DiscountGrpcService>();






// 4. API Services
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
