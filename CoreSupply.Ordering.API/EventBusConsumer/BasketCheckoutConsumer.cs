using CoreSupply.BuildingBlocks.Events;
using CoreSupply.BuildingBlocks.Messaging.Events; // برای دسترسی به ایونت‌های Saga
using CoreSupply.Ordering.API.Domain.Entities;
using CoreSupply.Ordering.API.Infrastructure.Persistence;
using Mapster;
using MassTransit;
using MediatR; // اگر از MediatR برای کامندها استفاده می‌کنید (اختیاری)

namespace CoreSupply.Ordering.API.EventBusConsumer;

public class BasketCheckoutConsumer : IConsumer<BasketCheckoutEvent>
{
    private readonly OrderContext _context;
    private readonly ILogger<BasketCheckoutConsumer> _logger;
    private readonly IPublishEndpoint _publishEndpoint; // [New] برای شروع Saga

    public BasketCheckoutConsumer(OrderContext context, ILogger<BasketCheckoutConsumer> logger, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<BasketCheckoutEvent> context)
    {
        _logger.LogInformation("Integration Event received: {EventId}", context.MessageId);

        var eventMsg = context.Message;

        // 1. تبدیل پیام به موجودیت سفارش (Mapping)
        // نکته: اینجا ساده‌سازی کردیم. در پروژه واقعی از MediatR Command استفاده کنید.
        var order = new Order
        {
            UserName = eventMsg.UserName,
            TotalPrice = eventMsg.TotalPrice,
            FirstName = eventMsg.FirstName,
            LastName = eventMsg.LastName,
            EmailAddress = eventMsg.EmailAddress,
            AddressLine = eventMsg.AddressLine,
            Country = eventMsg.Country,
            State = eventMsg.State,
            ZipCode = eventMsg.ZipCode,
            CardName = eventMsg.CardName,
            CardNumber = eventMsg.CardNumber,
            Expiration = eventMsg.Expiration,
            CVV = eventMsg.CVV,
            PaymentMethod = 1, // فرضا کارت
            Status = "Pending" // وضعیت اولیه
        };

        // 2. ذخیره در دیتابیس SQL
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Order {OrderId} saved successfully. Starting Saga...", order.Id);

        // 3. [CRITICAL STEP] شروع Saga
        // ارسال ایونتی که StateMachine منتظر آن است
        await _publishEndpoint.Publish(new OrderCreatedEvent(
            order.Id,
            order.UserName,
            order.TotalPrice
        ));
    }
}
