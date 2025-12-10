using CoreSupply.Catalog.API.Data;
using CoreSupply.Catalog.API.Repositories;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.BuildingBlocks.Observability;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. Observability (New Feature) ---
// فعال‌سازی OpenTelemetry برای مانیتورینگ
builder.AddCustomOpenTelemetry();

// --- 2. API Services ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 3. Database Configuration (Mongo) ---
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings")
);

builder.Services.AddScoped<IComponentRepository, ComponentRepository>();

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
