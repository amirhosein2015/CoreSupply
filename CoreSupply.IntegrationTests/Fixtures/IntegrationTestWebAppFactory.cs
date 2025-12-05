using CoreSupply.Ordering.API.Infrastructure.Persistence;
using DotNet.Testcontainers.Builders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.MsSql;

namespace CoreSupply.IntegrationTests.Fixtures
{
    public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
    {
        private readonly MsSqlContainer _dbContainer;

        // سازنده کلاس: اینجا آدرس داکر را ست می‌کنیم
        public IntegrationTestWebAppFactory()
        {
            // 1. تنظیم آدرس داکر برای ویندوز (حل خطای Docker not found)
            Environment.SetEnvironmentVariable("DOCKER_HOST", "npipe://./pipe/docker_engine");

            // 2. ساخت کانتینر با استراتژی انتظار هوشمند
            _dbContainer = new MsSqlBuilder()
                .WithImage("mcr.microsoft.com/mssql/server:2019-latest")
                .WithPassword("Password12!")
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

