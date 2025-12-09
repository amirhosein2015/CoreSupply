using CoreSupply.BuildingBlocks.DDD;
using CoreSupply.Ordering.API.Domain.Entities;
using CoreSupply.Ordering.API.Sagas; // [New] اضافه شد
using MassTransit; // [New] اضافه شد
using Microsoft.EntityFrameworkCore;

namespace CoreSupply.Ordering.API.Infrastructure.Persistence
{
    public class OrderContext : DbContext
    {
        public OrderContext(DbContextOptions<OrderContext> options) : base(options)
        {
        }

        public DbSet<Order> Orders { get; set; }

        // [New] جدول وضعیت Saga
        public DbSet<OrderState> OrderStates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // [New] تنظیمات مربوط به MassTransit Saga Persistence
            // این متدها جداول Inbox, Outbox و State را به صورت خودکار مپ می‌کنند
            modelBuilder.AddInboxStateEntity();
            modelBuilder.AddOutboxMessageEntity();
            modelBuilder.AddOutboxStateEntity();

            // تنظیم کلید اصلی برای OrderState
            modelBuilder.Entity<OrderState>().HasKey(x => x.CorrelationId);

            // کانفیگ‌های قبلی شما (اگر دارید)
            // modelBuilder.ApplyConfigurationsFromAssembly(typeof(OrderContext).Assembly);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // پر کردن خودکار فیلدهای Audit
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
