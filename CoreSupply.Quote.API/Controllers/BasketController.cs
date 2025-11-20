using CoreSupply.Quote.API.Models;
using CoreSupply.Quote.API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CoreSupply.Quote.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly IBasketRepository _repository;
        private readonly ILogger<BasketController> _logger;

        // Dependency Injection for Basket Repository
        public BasketController(IBasketRepository repository, ILogger<BasketController> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // --- GET /api/v1/Basket/{buyerId} ---
        [HttpGet("{buyerId}", Name = "GetBasket")]
        [ProducesResponseType(typeof(CustomerBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<CustomerBasket>> GetBasket(string buyerId)
        {
            _logger.LogInformation("Retrieving basket for BuyerId: {BuyerId}", buyerId);
            // GetBasketAsync returns an empty basket if none is found, so we always return 200 OK.
            var basket = await _repository.GetBasketAsync(buyerId);
            return Ok(basket);
        }

        // --- POST /api/v1/Basket ---
        [HttpPost]
        [ProducesResponseType(typeof(CustomerBasket), StatusCodes.Status200OK)]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket([FromBody] CustomerBasket basket)
        {
            _logger.LogInformation("Updating basket for BuyerId: {BuyerId}", basket.BuyerId);

            // We need a simple validation here. Check if items are valid.
            if (string.IsNullOrEmpty(basket.BuyerId))
            {
                return BadRequest("BuyerId is required.");
            }

            // In a real application, we would check Catalog.API for prices/existence here.

            var updatedBasket = await _repository.UpdateBasketAsync(basket);
            return Ok(updatedBasket);
        }

        // --- DELETE /api/v1/Basket/{buyerId} ---
        [HttpDelete("{buyerId}", Name = "DeleteBasket")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteBasket(string buyerId)
        {
            _logger.LogInformation("Deleting basket for BuyerId: {BuyerId}", buyerId);
            await _repository.DeleteBasketAsync(buyerId);
            return NoContent();
        }

        // --- POST /api/v1/Basket/Checkout ---
        [Route("[action]")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Checkout([FromBody] BasketCheckout basketCheckout)
        {
            // In a real application, this is where we would:
            // 1. Validate the basket content.
            // 2. Publish an event (e.g., BasketCheckoutEvent) to the Event Bus (RabbitMQ) for asynchronous processing (e.g., by the Ordering.API).
            // 3. Convert the basket to a FinalQuote in MongoDB.

            _logger.LogInformation("Checkout requested for BuyerId: {BuyerId}. This will be processed asynchronously.", basketCheckout.BuyerId);

            // For now, we simulate success and return Accepted (202)
            await _repository.DeleteBasketAsync(basketCheckout.BuyerId);

            return Accepted();
        }
    }
}

// Simple model for the checkout process data (needs to be created by the user)
// NOTE: For now, we will add a simple placeholder model. In a full solution, this would be a DTO with address, payment info, etc.
public class BasketCheckout
{
    public string BuyerId { get; set; }
}