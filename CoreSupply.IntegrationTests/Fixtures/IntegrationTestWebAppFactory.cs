using CoreSupply.Ordering.API.Infrastructure.Persistence;
using DotNet.Testcontainers.Builders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.MsSql;
using System.Runtime.InteropServices; // اضافه شد

namespace CoreSupply.IntegrationTests.Fixtures
{
    public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private readonly MsSqlContainer _dbContainer;

        public IntegrationTestWebAppFactory()
        {
            // فقط اگر روی ویندوز هستیم، این تنظیم را اعمال کن
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                Environment.SetEnvironmentVariable("DOCKER_HOST", "npipe://./pipe/docker_engine");
            }

            // ساخت کانتینر (مشترک برای همه سیستم‌عامل‌ها)
            _dbContainer = new MsSqlBuilder()
                .WithImage("mcr.microsoft.com/mssql/server:2019-latest")
                .WithPassword("Password12!")
                // استراتژی انتظار ساده‌تر برای لینوکس (چون سریع‌تر است)
                .WithWaitStrategy(Wait.ForUnixContainer().UntilMessageIsLogged(".*Recovery is complete.*"))
                .Build();
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<OrderContext>));

                if (descriptor != null) services.Remove(descriptor);

                services.AddDbContext<OrderContext>(options =>
                {
                    var connectionString = _dbContainer.GetConnectionString() + ";Connect Timeout=60";
                    options.UseSqlServer(connectionString);
                });
            });
        }

        public Task InitializeAsync()
        {
            return _dbContainer.StartAsync();
        }

        public new Task DisposeAsync()
        {
            return _dbContainer.StopAsync();
        }
    }
}
