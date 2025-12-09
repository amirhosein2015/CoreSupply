using MassTransit;

namespace CoreSupply.Ordering.API.Sagas;

public class OrderState : SagaStateMachineInstance
{
    public Guid CorrelationId { get; set; } // شناسه یکتا برای هر سفارش
    public string CurrentState { get; set; } // وضعیت فعلی (مثلاً: OrderSubmitted)

    public Guid OrderId { get; set; }
    public string CustomerId { get; set; }
    public decimal TotalPrice { get; set; }

    // زمان‌بندی (برای Timeoutها - اختیاری)
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
