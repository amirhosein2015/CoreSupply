using CoreSupply.Discount.Grpc.Protos;

namespace CoreSupply.Quote.API.Services;

public class DiscountGrpcService
{
    private readonly DiscountProtoService.DiscountProtoServiceClient _discountProtoService;

    public DiscountGrpcService(DiscountProtoService.DiscountProtoServiceClient discountProtoService)
    {
        _discountProtoService = discountProtoService ?? throw new ArgumentNullException(nameof(discountProtoService));
    }

    public async Task<CouponModel> GetDiscount(string productName)
    {
        // ساخت درخواست برای ارسال به سرور
        var discountRequest = new GetDiscountRequest { ProductName = productName };

        // فراخوانی متد gRPC
        return await _discountProtoService.GetDiscountAsync(discountRequest);
    }
}
