using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Events;

namespace CoreSupply.BuildingBlocks.Logging
{
    public static class LoggingExtensions
    {
        public static WebApplicationBuilder AddCustomSerilog(this WebApplicationBuilder builder)
        {
            builder.Host.UseSerilog((context, services, configuration) =>
            {
                configuration
                    .MinimumLevel.Information()
                    // حذف لاگ‌های سیستمی مزاحم
                    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                    .MinimumLevel.Override("System", LogEventLevel.Warning)
                    // اضافه کردن نام سرویس به لاگ‌ها (خیلی مهم برای تشخیص اینکه کدام سرویس لاگ انداخته)
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("ApplicationName", builder.Environment.ApplicationName)
                    // خروجی‌ها
                    .WriteTo.Console()
                    .WriteTo.Seq("http://core.seq:5341"); // آدرس کانتینر Seq
            });

            return builder;
        }
    }
}
