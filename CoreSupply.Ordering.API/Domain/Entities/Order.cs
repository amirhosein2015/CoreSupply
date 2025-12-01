using CoreSupply.BuildingBlocks.DDD;

namespace CoreSupply.Ordering.API.Domain.Entities
{
    // این کلاس اصلی سفارش است
    public class Order : Entity<Guid>
    {
        public string UserName { get; set; }
        public decimal TotalPrice { get; set; }

        // آدرس (Billing Address)
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string AddressLine { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }

        // پرداخت
        public string CardName { get; set; }
        public string CardNumber { get; set; }
        public string Expiration { get; set; }
        public string CVV { get; set; }
        public int PaymentMethod { get; set; }

        // وضعیت سفارش (یک Enum ساده)
        public string Status { get; set; } = "Pending"; // در آینده تبدیل به Enum می‌شود
    }
}
