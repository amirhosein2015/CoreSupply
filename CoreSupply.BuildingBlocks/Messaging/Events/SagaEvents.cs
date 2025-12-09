namespace CoreSupply.BuildingBlocks.Messaging.Events;

// 1. موجودی با موفقیت رزرو شد
public record StockReservedEvent(Guid OrderId);

// 2. موجودی کافی نبود (شکست)
public record StockReservationFailedEvent(Guid OrderId, string Reason);

// 3. پرداخت موفق بود
public record PaymentSucceededEvent(Guid OrderId);

// 4. پرداخت ناموفق بود (مثلاً موجودی ناکافی)
public record PaymentFailedEvent(Guid OrderId, string Reason);

// رویدادی که نشان می‌دهد سفارش اولیه ثبت شده است
public record OrderCreatedEvent(Guid OrderId, string CustomerId, decimal TotalPrice);
