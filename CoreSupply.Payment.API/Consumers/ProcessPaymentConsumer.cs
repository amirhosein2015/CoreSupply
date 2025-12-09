using CoreSupply.BuildingBlocks.Messaging.Commands;
using CoreSupply.BuildingBlocks.Messaging.Events;
using MassTransit;

namespace CoreSupply.Payment.API.Consumers;

public class ProcessPaymentConsumer : IConsumer<ProcessPaymentCommand>
{
    private readonly ILogger<ProcessPaymentConsumer> _logger;

    public ProcessPaymentConsumer(ILogger<ProcessPaymentConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<ProcessPaymentCommand> context)
    {
        var command = context.Message;
        _logger.LogInformation("💰 Processing payment for Order {OrderId}. Amount: ${Amount}", command.OrderId, command.TotalAmount);

        // --- شبیه‌سازی درگاه بانکی ---
        // اگر مبلغ کل منفی باشد، تراکنش رد می‌شود (تست شکست)
        bool isPaymentSuccessful = command.TotalAmount > 0;

        if (isPaymentSuccessful)
        {
            _logger.LogInformation("✅ Payment succeeded for Order {OrderId}", command.OrderId);
            await context.Publish(new PaymentSucceededEvent(command.OrderId));
        }
        else
        {
            _logger.LogError("❌ Payment failed for Order {OrderId}", command.OrderId);
            await context.Publish(new PaymentFailedEvent(command.OrderId, "Invalid Amount"));
        }
    }
}
