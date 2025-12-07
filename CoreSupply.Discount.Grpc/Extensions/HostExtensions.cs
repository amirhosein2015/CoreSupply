
using System.Data.SQLite;
using Dapper;

namespace CoreSupply.Discount.Grpc.Extensions
{
    public static class HostExtensions
    {
        public static IHost MigrateDatabase<TContext>(this IHost host)
        {
            using var scope = host.Services.CreateScope();
            var services = scope.ServiceProvider;
            var configuration = services.GetRequiredService<IConfiguration>();
            var logger = services.GetRequiredService<ILogger<TContext>>();

            try
            {
                logger.LogInformation("Migrating sqlite database.");

                var connectionString = configuration.GetValue<string>("DatabaseSettings:ConnectionString");

                // ساخت فایل دیتابیس اگر وجود ندارد
                // نکته: Dapper خودش فایل را نمی‌سازد، باید با SQLiteConnection بسازیم
                // اما در محیط داکر، بهتر است مسیر فایل را چک کنیم

                using var connection = new SQLiteConnection(connectionString);
                connection.Open();

                using var command = connection.CreateCommand();
                command.CommandText = "DROP TABLE IF EXISTS Coupon";
                command.ExecuteNonQuery();

                command.CommandText = @"CREATE TABLE Coupon(Id INTEGER PRIMARY KEY, 
                                                            ProductName TEXT,
                                                            Description TEXT,
                                                            Amount INT)";
                command.ExecuteNonQuery();

                // Seed Data (دیتای اولیه)
                command.CommandText = "INSERT INTO Coupon(ProductName, Description, Amount) VALUES('IPhone X', 'IPhone Discount', 150);";
                command.ExecuteNonQuery();

                command.CommandText = "INSERT INTO Coupon(ProductName, Description, Amount) VALUES('Samsung 10', 'Samsung Discount', 100);";
                command.ExecuteNonQuery();

                logger.LogInformation("Migrated sqlite database.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while migrating the sqlite database");
            }

            return host;
        }
    }
}
