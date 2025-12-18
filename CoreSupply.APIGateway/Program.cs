using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.BuildingBlocks.Observability;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. Observability ---
builder.AddCustomOpenTelemetry();

// ✅ --- 3. CORS Configuration (Added for Industrial Stability) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // آدرس فرانت‌اِند
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// بارگذاری تنظیمات Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// افزودن سرویس Ocelot
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

// ✅ فعال‌سازی سیاست CORS قبل از Ocelot
app.UseCors("CorsPolicy");

// فعال‌سازی Ocelot
await app.UseOcelot();

app.Run();
