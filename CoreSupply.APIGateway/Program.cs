using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using CoreSupply.BuildingBlocks.Logging;
using CoreSupply.BuildingBlocks.Observability;



var builder = WebApplication.CreateBuilder(args);

// --- 1. Logging ---
builder.AddCustomSerilog();

// --- 2. Observability (New Feature) ---
// فعال‌سازی OpenTelemetry برای مانیتورینگ
builder.AddCustomOpenTelemetry();


// بارگذاری تنظیمات Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// افزودن سرویس Ocelot
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

// فعال‌سازی Ocelot
await app.UseOcelot();

app.Run();
