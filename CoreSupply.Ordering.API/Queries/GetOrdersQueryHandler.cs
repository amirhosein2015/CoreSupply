using MediatR;
using CoreSupply.Ordering.API.Infrastructure.Persistence;
using CoreSupply.Ordering.API.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System; //  اضافه شد برای Exception
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CoreSupply.Ordering.API.Application.Queries
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, IEnumerable<Order>>
    {
        private readonly OrderContext _context;

        public GetOrdersQueryHandler(OrderContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // ✅ کوئری با AsNoTracking برای سرعت بیشتر و جلوگیری از کرش دیتابیس
                var orders = await _context.Orders
                                           .Where(o => o.UserName == request.UserName)
                                           .AsNoTracking()
                                           .ToListAsync(cancellationToken);

                return orders;
            }
            catch (Exception ex)
            {
                // لاگ کردن خطا در کنسول داکر برای دیباگ بعدی
                Console.WriteLine($"[CRITICAL] Order DB Access Failed: {ex.Message}");

                // برگرداندن یک لیست خالی به جای کرش کردن کل سرویس
                return new List<Order>();
            }
        }
    }
}
