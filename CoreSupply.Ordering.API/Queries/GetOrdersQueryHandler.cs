// Application/Queries/GetOrdersQueryHandler.cs
using MediatR;
using CoreSupply.Ordering.API.Infrastructure.Persistence; // ✅ اصلاح شد
using CoreSupply.Ordering.API.Domain.Entities; // ✅ اصلاح شد
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CoreSupply.Ordering.API.Application.Queries
{
    public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, IEnumerable<Order>>
    {
        private readonly OrderContext _context; // نام DbContext شما ممکن است فرق کند

        public GetOrdersQueryHandler(OrderContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
        {
            var orders = await _context.Orders
                                       .Where(o => o.UserName == request.UserName)
                                       .ToListAsync(cancellationToken);
            return orders;
        }
    }
}
