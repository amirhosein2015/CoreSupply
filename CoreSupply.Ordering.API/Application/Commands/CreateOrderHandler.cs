using CoreSupply.BuildingBlocks.CQRS;
using CoreSupply.Ordering.API.Domain.Entities;
using CoreSupply.Ordering.API.Infrastructure.Persistence;
using Mapster; // برای تبدیل مدل‌ها

namespace CoreSupply.Ordering.API.Application.Commands
{
    public class CreateOrderHandler : ICommandHandler<CreateOrderCommand, Guid>
    {
        private readonly OrderContext _context;

        public CreateOrderHandler(OrderContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(CreateOrderCommand command, CancellationToken cancellationToken)
        {
            // 1. تبدیل دستور به موجودیت Order
            // (چون اسم فیلدها یکی است، مپستر خودکار انجام می‌دهد)
            var orderEntity = command.Adapt<Order>();

            // 2. اضافه کردن به دیتابیس
            _context.Orders.Add(orderEntity);

            // 3. ذخیره تغییرات
            await _context.SaveChangesAsync(cancellationToken);

            // 4. برگرداندن شناسه جدید
            return orderEntity.Id;
        }
    }
}
