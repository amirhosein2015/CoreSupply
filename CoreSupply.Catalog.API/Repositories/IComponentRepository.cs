using CoreSupply.Catalog.API.Models;

namespace CoreSupply.Catalog.API.Repositories
{
    public interface IComponentRepository
    {
        // CRUD Operations

        Task<IEnumerable<Component>> GetComponents();
        Task<Component> GetComponent(string id);
        Task<IEnumerable<Component>> GetComponentByName(string name);
        Task<IEnumerable<Component>> GetComponentByCategory(string category);

        Task CreateComponent(Component component);
        Task<bool> UpdateComponent(Component component);
        Task<bool> DeleteComponent(string id);
    }
}