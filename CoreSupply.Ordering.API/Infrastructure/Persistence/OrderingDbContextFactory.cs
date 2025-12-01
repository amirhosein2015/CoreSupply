using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CoreSupply.Ordering.API.Infrastructure.Persistence
{
    public class OrderingDbContextFactory : IDesignTimeDbContextFactory<OrderContext>
    {
        public OrderContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<OrderContext>();

            // اتصال به پورت 1433 لوکال (همان پورتی که کانتینر procurementdb روی آن است)
            optionsBuilder.UseSqlServer("Server=localhost,1433;Database=OrderingDb;User Id=sa;Password=Password12!;TrustServerCertificate=True;");

            return new OrderContext(optionsBuilder.Options);
        }
    }
}
