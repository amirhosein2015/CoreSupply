// Application/Queries/GetOrdersQuery.cs
using MediatR;
using CoreSupply.Ordering.API.Domain.Entities; 
using System.Collections.Generic;

namespace CoreSupply.Ordering.API.Application.Queries
{
    public class GetOrdersQuery : IRequest<IEnumerable<Order>>
    {
        public string UserName { get; set; }

        public GetOrdersQuery(string userName)
        {
            UserName = userName;
        }
    }
}
