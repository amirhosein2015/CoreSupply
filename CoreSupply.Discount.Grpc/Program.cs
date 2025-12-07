using CoreSupply.Discount.Grpc.Repositories;
using CoreSupply.Discount.Grpc.Services;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.Discount.Grpc.Extensions; 

var builder = WebApplication.CreateBuilder(args);

// 1. Logging
builder.AddCustomSerilog();

// 2. Services
builder.Services.AddGrpc();
builder.Services.AddScoped<IDiscountRepository, DiscountRepository>();

var app = builder.Build();

// 3. Database Migration (اجرای اکستنشن متد)
app.MigrateDatabase<Program>();

app.MapGrpcService<DiscountService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client.");

app.Run();

