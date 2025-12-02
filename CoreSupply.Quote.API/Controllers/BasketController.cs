using CoreSupply.Quote.API.Models;
using CoreSupply.Quote.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using CoreSupply.BuildingBlocks.Events;
using MassTransit;
using System.Net;

namespace CoreSupply.Quote.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly IBasketRepository _repository;
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly IBus _bus; // اضافه شده برای ارسال مستقیم
        private readonly ILogger<BasketController> _logger;

        public BasketController(IBasketRepository repository, IPublishEndpoint publishEndpoint, IBus bus, ILogger<BasketController> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _publishEndpoint = publishEndpoint ?? throw new ArgumentNullException(nameof(publishEndpoint));
            _bus = bus ?? throw new ArgumentNullException(nameof(bus));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // --- GET ---
        [HttpGet("{buyerId}", Name = "GetBasket")]
        [ProducesResponseType(typeof(CustomerBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<CustomerBasket>> GetBasket(string buyerId)
        {
            var basket = await _repository.GetBasketAsync(buyerId);
            return Ok(basket ?? new CustomerBasket(buyerId));
        }

        // --- POST ---
        [HttpPost]
        [ProducesResponseType(typeof(CustomerBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket([FromBody] CustomerBasket basket)
        {
            if (string.IsNullOrEmpty(basket.BuyerId))
            {
                return BadRequest("BuyerId is required.");
            }
            var updatedBasket = await _repository.UpdateBasketAsync(basket);
            return Ok(updatedBasket);
        }

        // --- DELETE ---
        [HttpDelete("{buyerId}", Name = "DeleteBasket")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteBasket(string buyerId)
        {
            await _repository.DeleteBasketAsync(buyerId);
            return NoContent();
        }

        // --- CHECKOUT ---
        [Route("[action]")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Checkout([FromBody] BasketCheckout basketCheckout)
        {
            // 1. دریافت سبد خرید
            var basket = await _repository.GetBasketAsync(basketCheckout.UserName);
            if (basket == null)
            {
                return BadRequest("Basket not found");
            }

            // 2. ساخت ایونت
            var eventMessage = new BasketCheckoutEvent
            {
                UserName = basketCheckout.UserName,
                TotalPrice = basket.TotalCost(),
                FirstName = basketCheckout.FirstName,
                LastName = basketCheckout.LastName,
                EmailAddress = basketCheckout.EmailAddress,
                AddressLine = basketCheckout.AddressLine,
                Country = basketCheckout.Country,
                State = basketCheckout.State,
                ZipCode = basketCheckout.ZipCode,
                CardName = basketCheckout.CardName,
                CardNumber = basketCheckout.CardNumber,
                Expiration = basketCheckout.Expiration,
                CVV = basketCheckout.CVV,
                PaymentMethod = basketCheckout.PaymentMethod
            };

            // 3. ارسال مستقیم به صف (از _bus استفاده می‌کنیم)
            var endpoint = await _bus.GetSendEndpoint(new Uri("queue:basket-checkout-queue"));
            await endpoint.Send(eventMessage);

            _logger.LogInformation("Checkout event SENT to queue:basket-checkout-queue for User: {UserName}", basketCheckout.UserName);

            // 4. حذف سبد خرید
            await _repository.DeleteBasketAsync(basket.BuyerId);

            return Accepted();
        }
    }

    public class BasketCheckout
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string AddressLine { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string CardName { get; set; }
        public string CardNumber { get; set; }
        public string Expiration { get; set; }
        public string CVV { get; set; }
        public int PaymentMethod { get; set; }
    }
}
