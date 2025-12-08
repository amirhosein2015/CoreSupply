using CoreSupply.Discount.Grpc.Repositories;
using CoreSupply.Discount.Grpc.Services;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.Discount.Grpc.Extensions;

var builder = WebApplication.CreateBuilder(args);

// 1. Logging
builder.AddCustomSerilog();

// 2. Services
builder.Services.AddGrpc();
builder.Services.AddGrpcReflection(); // ✅ حیاتی برای تست

builder.Services.AddScoped<IDiscountRepository, DiscountRepository>();

var app = builder.Build();

// 3. Database Migration
app.MigrateDatabase<Program>();

// 4. Configure Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapGrpcReflectionService(); // ✅ حیاتی برای دیدن سرویس‌ها
}

app.MapGrpcService<DiscountService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client.");

app.Run();
