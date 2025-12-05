using CoreSupply.Ordering.API.Infrastructure.Persistence;
using DotNet.Testcontainers.Builders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.MsSql;
using System.Runtime.InteropServices;

namespace CoreSupply.IntegrationTests.Fixtures
{
    public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private readonly MsSqlContainer? _dbContainer;
        private readonly bool _useTestContainers;

        public IntegrationTestWebAppFactory()
        {
            // اگر در محیط CI (گیت‌هاب) هستیم، از Testcontainers استفاده نکن!
            // (متغیر CI به طور خودکار توسط GitHub Actions مقداردهی می‌شود)
            var isCiEnvironment = Environment.GetEnvironmentVariable("CI") == "true";

            _useTestContainers = !isCiEnvironment; // فقط در لوکال استفاده کن

            if (_useTestContainers)
            {
                // تنظیمات ویندوز لوکال
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    Environment.SetEnvironmentVariable("DOCKER_HOST", "npipe:////./pipe/docker_engine");
                }

                _dbContainer = new MsSqlBuilder()
                    .WithImage("mcr.microsoft.com/mssql/server:2019-latest")
                    .WithPassword("Password12!")
                    .WithWaitStrategy(Wait.ForUnixContainer().UntilMessageIsLogged(".*Recovery is complete.*"))
                    .Build();
            }
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
                    if (_useTestContainers && _dbContainer != null)
                    {
                        // استراتژی حرفه‌ای (لوکال)
                        var connectionString = _dbContainer.GetConnectionString() + ";Connect Timeout=60";
                        options.UseSqlServer(connectionString);
                    }
                    else
                    {
                        // استراتژی سریع و امن (CI/CD)
                        options.UseInMemoryDatabase("IntegrationTestDb");
                    }
                });
            });
        }

        public async Task InitializeAsync()
        {
            if (_useTestContainers && _dbContainer != null)
            {
                await _dbContainer.StartAsync();
            }
        }

        public new async Task DisposeAsync()
        {
            if (_useTestContainers && _dbContainer != null)
            {
                await _dbContainer.StopAsync();
            }
        }
    }
}
