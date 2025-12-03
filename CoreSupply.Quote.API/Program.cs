using CoreSupply.Quote.API.Repositories;
using MassTransit; // اضافه شد
using CoreSupply.BuildingBlocks.Logging;




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
