namespace CoreSupply.Discount.Grpc.Entities
{
    public class Coupon
    {
        public int Id { get; set; }
        public required string ProductName { get; set; }
        public required string Description { get; set; }
        public int Amount { get; set; }
    }
}
