using CoreSupply.Quote.API.Models;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace CoreSupply.Quote.API.Repositories
{
    public interface IBasketRepository
    {
        Task<CustomerBasket> GetBasketAsync(string buyerId);
        Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket);
        Task DeleteBasketAsync(string buyerId);
    }

    public class BasketRepository : IBasketRepository
    {
        // IDistributedCache is an abstraction that allows us to use Redis
        private readonly IDistributedCache _redisCache;

        public BasketRepository(IDistributedCache cache)
        {
            _redisCache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        public async Task<CustomerBasket> GetBasketAsync(string buyerId)
        {
            var basketData = await _redisCache.GetStringAsync(buyerId);

            if (string.IsNullOrEmpty(basketData))
            {
                // If basket not found, return an empty basket object
                return new CustomerBasket(buyerId);
            }

            // Deserialize the JSON string back into a CustomerBasket object
            return JsonSerializer.Deserialize<CustomerBasket>(basketData);
        }

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            // Serialize the basket object to a JSON string
            await _redisCache.SetStringAsync(basket.BuyerId, JsonSerializer.Serialize(basket));

            return await GetBasketAsync(basket.BuyerId);
        }

        public async Task DeleteBasketAsync(string buyerId)
        {
            await _redisCache.RemoveAsync(buyerId);
        }
    }
}