using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace CoreSupply.Quote.API.Models
{
    // Represents a single item within the Quote/Basket
    public class QuoteItem
    {
        public string ComponentId { get; set; } // ID of the component from Catalog.API
        public string ComponentName { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice
        {
            get => UnitPrice * Quantity;
        }
    }

    // Represents the temporary shopping basket stored in Redis
    public class CustomerBasket
    {
        public string BuyerId { get; set; } // Unique identifier for the customer/session
        public List<QuoteItem> Items { get; set; } = new List<QuoteItem>();

        public CustomerBasket(string buyerId)
        {
            BuyerId = buyerId;
        }

        public decimal TotalCost()
        {
            decimal total = 0;
            foreach (var item in Items)
            {
                total += item.TotalPrice;
            }
            return total;
        }
    }

    // Represents a finalized quote document stored in MongoDB
    public class FinalQuote
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string BuyerId { get; set; }
        public List<QuoteItem> Items { get; set; } = new List<QuoteItem>();
        public decimal FinalAmount { get; set; }
        public QuoteStatus Status { get; set; } = QuoteStatus.Pending;
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    }

    public enum QuoteStatus
    {
        Pending,
        Approved,
        Rejected,
        ConvertedToOrder
    }
}