using CoreSupply.Catalog.API.Models;
using CoreSupply.Catalog.API.Data; 
using MongoDB.Driver;
using Microsoft.Extensions.Options; 

namespace CoreSupply.Catalog.API.Repositories
{
    public class ComponentRepository : IComponentRepository
    {
        // Private field for MongoDB collection
        private readonly IMongoCollection<Component> _componentCollection;



        // Constructor now accepts IOptions<DatabaseSettings> for configuration injection
        public ComponentRepository(IOptions<DatabaseSettings> settings)
        {
            // settings.Value حالا به DatabaseSettings ما (که از appsettings.json خوانده شده) دسترسی دارد
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);

            _componentCollection = database.GetCollection<Component>(settings.Value.CollectionName);

            // Optional: ComponentContextSeed.SeedData(_componentCollection);
        }



        public async Task CreateComponent(Component component)
        {
            await _componentCollection.InsertOneAsync(component);
        }

        public async Task<bool> DeleteComponent(string id)
        {
            FilterDefinition<Component> filter = Builders<Component>.Filter.Eq(p => p.Id, id);

            DeleteResult deleteResult = await _componentCollection.DeleteOneAsync(filter);

            return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
        }

        public async Task<Component> GetComponent(string id)
        {
            return await _componentCollection
                           .Find(p => p.Id == id)
                           .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Component>> GetComponentByCategory(string category)
        {
            FilterDefinition<Component> filter = Builders<Component>.Filter.Eq(p => p.Category, category);

            return await _componentCollection
                           .Find(filter)
                           .ToListAsync();
        }

        public async Task<IEnumerable<Component>> GetComponentByName(string name)
        {
            FilterDefinition<Component> filter = Builders<Component>.Filter.Eq(p => p.Name, name);

            return await _componentCollection
                           .Find(filter)
                           .ToListAsync();
        }

        public async Task<IEnumerable<Component>> GetComponents()
        {
            return await _componentCollection
                           .Find(p => true)
                           .ToListAsync();
        }

        public async Task<bool> UpdateComponent(Component component)
        {
            var updateResult = await _componentCollection
                                    .ReplaceOneAsync(filter: g => g.Id == component.Id, replacement: component);

            return updateResult.IsAcknowledged && updateResult.ModifiedCount > 0;
        }
    }
}