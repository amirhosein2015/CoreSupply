using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CoreSupply.Catalog.API.Models
{
    public class Component
    {
        // MongoDB uses BsonId as the unique identifier.
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }

        public string Category { get; set; }

        public string Summary { get; set; }

        public string Description { get; set; }

        // The image file name for the component.
        public string ImageFile { get; set; }

        // Price, stored as decimal.
        [BsonElement("Price")]
        public decimal Price { get; set; }
    }
}