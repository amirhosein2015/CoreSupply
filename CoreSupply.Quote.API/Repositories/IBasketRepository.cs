using CoreSupply.Quote.API.Models;
using CoreSupply.Quote.API.Services; // Ensure this namespace matches where DiscountGrpcService is located
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
        private readonly IDistributedCache _redisCache;
        private readonly DiscountGrpcService _discountGrpcService; // [NEW] Inject gRPC Service

        public BasketRepository(IDistributedCache cache, DiscountGrpcService discountGrpcService)
        {
            _redisCache = cache ?? throw new ArgumentNullException(nameof(cache));
            _discountGrpcService = discountGrpcService ?? throw new ArgumentNullException(nameof(discountGrpcService));
        }

        public async Task<CustomerBasket> GetBasketAsync(string buyerId)
        {
            var basketData = await _redisCache.GetStringAsync(buyerId);

            if (string.IsNullOrEmpty(basketData))
            {
                // If basket not found, return null or empty basket as per your logic
                // Returning null here so Controller can handle 404 or create new
                return null;
            }

            return JsonSerializer.Deserialize<CustomerBasket>(basketData);
        }

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            // [NEW LOGIC] Communicate with Discount.Grpc via the injected service
            // Before saving to Redis, update prices based on discounts
            foreach (var item in basket.Items)
            {
                try
                {
                    // Call the gRPC service
                    var coupon = await _discountGrpcService.GetDiscount(item.ComponentName);

                    // Subtract discount amount from the original price
                    // Ensure price doesn't go below zero
                    if (coupon.Amount > 0)
                    {
                        item.UnitPrice -= coupon.Amount;
                        if (item.UnitPrice < 0) item.UnitPrice = 0;
                    }
                }
                catch (Exception ex)
                {
                    // [Principal Note] Fail-safe Strategy:
                    // If Discount service is down, we log the error but DO NOT stop the process.
                    // The user will simply pay the full price. Availability > Consistency here.
                    Console.WriteLine($"Error getting discount for {item.ComponentName}: {ex.Message}");
                }
            }

            // Serialize and Save to Redis
            await _redisCache.SetStringAsync(basket.BuyerId, JsonSerializer.Serialize(basket));

            return await GetBasketAsync(basket.BuyerId);
        }

        public async Task DeleteBasketAsync(string buyerId)
        {
            await _redisCache.RemoveAsync(buyerId);
        }
    }
}
