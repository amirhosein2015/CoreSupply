// Controllers/OrderController.cs
using CoreSupply.Ordering.API.Application.Commands;
using CoreSupply.Ordering.API.Application.Queries; 
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using CoreSupply.Ordering.API.Domain.Entities; 

namespace CoreSupply.Ordering.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OrderController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // ... متد Post قبلی ...
        [HttpPost(Name = "CheckoutOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<Guid>> CheckoutOrder([FromBody] CreateOrderCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        // ✅ متد جدید
        [HttpGet("{userName}", Name = "GetOrdersByUserName")]
        [ProducesResponseType(typeof(IEnumerable<Order>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByUserName(string userName)
        {
            var query = new GetOrdersQuery(userName);
            var orders = await _mediator.Send(query);
            return Ok(orders);
        }

        // ... متد GetOrders قبلی ...
        [HttpGet("admin/all-orders")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllOrders()
        {
            return Ok("This is a secured endpoint for Admins only!");
        }
    }
}
