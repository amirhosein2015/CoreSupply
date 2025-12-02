using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

// بارگذاری تنظیمات Ocelot
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// افزودن سرویس Ocelot
builder.Services.AddOcelot(builder.Configuration);

var app = builder.Build();

// فعال‌سازی Ocelot
await app.UseOcelot();

app.Run();
