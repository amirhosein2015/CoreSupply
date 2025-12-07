using CoreSupply.Discount.Grpc.Protos;

namespace CoreSupply.Quote.API.Services
{
    public class DiscountGrpcService
    {
        private readonly DiscountProtoService.DiscountProtoServiceClient _discountProtoService;

        public DiscountGrpcService(DiscountProtoService.DiscountProtoServiceClient discountProtoService)
        {
            _discountProtoService = discountProtoService;
        }

        public async Task<CouponModel> GetDiscount(string productName)
        {
            try
            {
                var discountRequest = new GetDiscountRequest { ProductName = productName };
                return await _discountProtoService.GetDiscountAsync(discountRequest);
            }
            catch
            {
                // اگر تخفیف پیدا نشد یا ارور داد، صفر برگردان (Fail-Safe)
                return new CouponModel { ProductName = "No Discount", Amount = 0, Description = "No Discount Desc" };
            }
        }
    }
}
