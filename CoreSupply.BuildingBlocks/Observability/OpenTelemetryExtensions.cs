using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace CoreSupply.BuildingBlocks.Observability;

public static class OpenTelemetryExtensions
{
    public static WebApplicationBuilder AddCustomOpenTelemetry(this WebApplicationBuilder builder)
    {
        var serviceName = builder.Environment.ApplicationName; // نام سرویس را خودکار برمی‌دارد

        // تنظیمات Resource (مشخصات سرویس)
        var resourceBuilder = ResourceBuilder.CreateDefault()
            .AddService(serviceName)
            .AddTelemetrySdk()
            .AddAttributes(new Dictionary<string, object>
            {
                ["environment"] = builder.Environment.EnvironmentName,
                ["team"] = "CoreSupply_DevTeam"
            });

        // اضافه کردن Tracing
        builder.Services.AddOpenTelemetry()
            .WithTracing(tracing =>
            {
                tracing
                    .SetResourceBuilder(resourceBuilder)
                    .AddAspNetCoreInstrumentation() // تریس کردن درخواست‌های ورودی API
                    .AddHttpClientInstrumentation() // تریس کردن درخواست‌های خروجی HTTP
                    .AddGrpcClientInstrumentation() // تریس کردن gRPC (برای Basket->Discount)
                  .AddEntityFrameworkCoreInstrumentation() // بدون هیچ آپشنی
                                                           // تریس کردن کوئری‌های SQL
                   
                    .AddSource("MassTransit") // سورس مس‌ترنزیت
                                        .AddOtlpExporter(options =>
                                        {
                                            // آدرس کانتینر Jaeger با پورت HTTP
                                            options.Endpoint = new Uri("http://core.jaeger:4318/v1/traces");
                                            // پروتکل انتقال
                                            options.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.HttpProtobuf;
                                        });  // <--- این نقطه ویرگول (;) حیاتی است!
            });
     

        // (اختیاری) اضافه کردن Metrics - فعلاً ساده نگه می‌داریم

        return builder;
    }
}
