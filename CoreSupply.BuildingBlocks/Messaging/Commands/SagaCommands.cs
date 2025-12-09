namespace CoreSupply.BuildingBlocks.Messaging.Commands;

// مدل کمکی برای آیتم‌های سفارش (فقط دیتاست، منطق ندارد)
public record OrderItemMessage(string ProductId, int Quantity);

// 1. دستور رزرو موجودی (از طرف Ordering به Inventory)
public record ReserveStockCommand(Guid OrderId, string CustomerId, List<OrderItemMessage> Items);

// 2. دستور پردازش پرداخت (از طرف Ordering به Payment)
public record ProcessPaymentCommand(Guid OrderId, string CustomerId, decimal TotalAmount);

// 3. دستور آزادسازی موجودی (در صورت شکست پرداخت - جبران خسارت)
public record ReleaseStockCommand(Guid OrderId, List<OrderItemMessage> Items);
