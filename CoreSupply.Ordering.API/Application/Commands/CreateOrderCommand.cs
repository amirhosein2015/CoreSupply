using CoreSupply.BuildingBlocks.CQRS;

namespace CoreSupply.Ordering.API.Application.Commands
{
    // ورودی: اطلاعات سفارش | خروجی: شناسه سفارش ساخته شده (Guid)
    public class CreateOrderCommand : ICommand<Guid>
    {
        public string UserName { get; set; }
        public decimal TotalPrice { get; set; }

        // آدرس
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
    }
}
