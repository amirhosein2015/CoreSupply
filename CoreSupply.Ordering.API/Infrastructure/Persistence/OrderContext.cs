using CoreSupply.BuildingBlocks.DDD;
using CoreSupply.Ordering.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CoreSupply.Ordering.API.Infrastructure.Persistence
{
    public class OrderContext : DbContext
    {
        public OrderContext(DbContextOptions<OrderContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // اینجا می‌توانید تنظیمات خاص دیتابیس را بنویسید
            // مثلا محدودیت طول رشته‌ها و غیره
            base.OnModelCreating(modelBuilder);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // پر کردن خودکار فیلدهای Audit (تاریخ ایجاد و ویرایش)
            foreach (var entry in ChangeTracker.Entries<Entity<Guid>>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        entry.Entity.CreatedBy = "swn"; // بعدا از Identity میخوانیم
                        break;
                    case EntityState.Modified:
                        entry.Entity.LastModified = DateTime.UtcNow;
                        entry.Entity.LastModifiedBy = "swn";
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
