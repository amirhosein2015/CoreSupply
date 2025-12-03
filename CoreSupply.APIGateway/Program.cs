using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using CoreSupply.BuildingBlocks.Logging;



var builder = WebApplication.CreateBuilder(args);
builder.AddCustomSerilog();


// بارگذاری تنظیمات Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// افزودن سرویس Ocelot
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

// فعال‌سازی Ocelot
await app.UseOcelot();

app.Run();
