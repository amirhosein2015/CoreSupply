using CoreSupply.BuildingBlocks.Events; // استفاده از قرارداد مشترک
using CoreSupply.Ordering.API.Application.Commands;
using MassTransit;
using MediatR;
using Mapster;

namespace CoreSupply.Ordering.API.EventBusConsumer
{
    // این کلاس مسئول دریافت پیام از RabbitMQ است
    public class BasketCheckoutConsumer : IConsumer<BasketCheckoutEvent>
    {
        private readonly IMediator _mediator;
        private readonly ILogger<BasketCheckoutConsumer> _logger;

        public BasketCheckoutConsumer(IMediator mediator, ILogger<BasketCheckoutConsumer> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<BasketCheckoutEvent> context)
        {
            // 1. دریافت پیام
            var eventMessage = context.Message;

            _logger.LogInformation("BasketCheckoutEvent consumed successfully. Creating Order for User: {UserName}", eventMessage.UserName);

            // 2. تبدیل پیام (Event) به دستور داخلی (Command)
            // چون ما قبلاً لاجیک ثبت سفارش را در CreateOrderCommand نوشتیم، دوباره آن را صدا می‌زنیم
            var command = eventMessage.Adapt<CreateOrderCommand>();

            // 3. ارسال دستور به هندلر (CQRS)
            var result = await _mediator.Send(command);

            _logger.LogInformation("Order created successfully with Id: {OrderId}", result);
        }
    }
}
