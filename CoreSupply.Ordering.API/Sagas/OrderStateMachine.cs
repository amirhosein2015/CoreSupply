using CoreSupply.BuildingBlocks.Messaging.Commands;
using CoreSupply.BuildingBlocks.Messaging.Events;
using MassTransit;

namespace CoreSupply.Ordering.API.Sagas;

public class OrderStateMachine : MassTransitStateMachine<OrderState>
{
    public State StockReservationPending { get; private set; }
    public State PaymentPending { get; private set; }
    public State Completed { get; private set; }
    public State Failed { get; private set; }

    public Event<OrderCreatedEvent> OrderCreated { get; private set; }
    public Event<StockReservedEvent> StockReserved { get; private set; }
    public Event<StockReservationFailedEvent> StockReservationFailed { get; private set; }
    public Event<PaymentSucceededEvent> PaymentSucceeded { get; private set; }
    public Event<PaymentFailedEvent> PaymentFailed { get; private set; }

    public OrderStateMachine()
    {
        InstanceState(x => x.CurrentState);

        Event(() => OrderCreated, x => x.CorrelateById(m => m.Message.OrderId));
        Event(() => StockReserved, x => x.CorrelateById(m => m.Message.OrderId));
        Event(() => StockReservationFailed, x => x.CorrelateById(m => m.Message.OrderId));
        Event(() => PaymentSucceeded, x => x.CorrelateById(m => m.Message.OrderId));
        Event(() => PaymentFailed, x => x.CorrelateById(m => m.Message.OrderId));

        Initially(
            When(OrderCreated)
                .Then(context =>
                {
                    context.Saga.OrderId = context.Message.OrderId;
                    context.Saga.CustomerId = context.Message.CustomerId;
                    context.Saga.TotalPrice = context.Message.TotalPrice;
                    context.Saga.CreatedAt = DateTime.UtcNow;
                })
                // به جای SendCommand از Publish استفاده می‌کنیم که راحت‌تر است
                .Publish(context => new ReserveStockCommand(
                    context.Message.OrderId,
                    context.Message.CustomerId,
                    new List<OrderItemMessage>()
                ))
                .TransitionTo(StockReservationPending)
        );

        During(StockReservationPending,
            When(StockReserved)
                .Publish(context => new ProcessPaymentCommand(
                    context.Saga.OrderId,
                    context.Saga.CustomerId,
                    context.Saga.TotalPrice
                ))
                .TransitionTo(PaymentPending),

            When(StockReservationFailed)
                .TransitionTo(Failed)
        );

        During(PaymentPending,
            When(PaymentSucceeded)
                .TransitionTo(Completed),

            When(PaymentFailed)
                .Publish(context => new ReleaseStockCommand(context.Saga.OrderId, new List<OrderItemMessage>()))
                .TransitionTo(Failed)
        );
    }
}
