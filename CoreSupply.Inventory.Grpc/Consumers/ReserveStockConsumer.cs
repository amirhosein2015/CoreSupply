using CoreSupply.BuildingBlocks.Messaging.Commands;
using CoreSupply.BuildingBlocks.Messaging.Events;
using MassTransit;

namespace CoreSupply.Inventory.Grpc.Consumers;

// این کلاس مصرف‌کننده پیام ReserveStockCommand است
public class ReserveStockConsumer : IConsumer<ReserveStockCommand>
{
    private readonly ILogger<ReserveStockConsumer> _logger;

    public ReserveStockConsumer(ILogger<ReserveStockConsumer> logger)
    {
        _logger = logger;
    }


    public async Task Consume(ConsumeContext<ReserveStockCommand> context)
    {
        var command = context.Message;
        _logger.LogInformation("📦 Checking inventory for Order {OrderId}", command.OrderId);

        // [MODIFIED LOGIC] برای تست شکست: اگر CustomerId برابر "fail" بود، موجودی نداریم.
        bool isStockAvailable = command.CustomerId != "fail";

        if (isStockAvailable)
        {
            _logger.LogInformation("✅ Stock reserved for Order {OrderId}", command.OrderId);
            await context.Publish(new StockReservedEvent(command.OrderId));
        }
        else
        {
            _logger.LogWarning("❌ Not enough stock for Order {OrderId} (Simulated Failure)", command.OrderId);
            await context.Publish(new StockReservationFailedEvent(command.OrderId, "Simulated OutOfStock"));
        }
    }



}
