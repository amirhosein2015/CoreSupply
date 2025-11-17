using CoreSupply.Catalog.API.Models;
using CoreSupply.Catalog.API.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace CoreSupply.Catalog.API.Controllers
{
    [Route("api/v1/[controller]")] // Define the base route for the API
    [ApiController]
    public class CatalogController : ControllerBase
    {
        private readonly IComponentRepository _repository;
        private readonly ILogger<CatalogController> _logger; // Standard practice for logging

        // Constructor with Dependency Injection
        public CatalogController(IComponentRepository repository, ILogger<CatalogController> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // GET api/v1/Catalog
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Component>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<Component>>> GetComponents()
        {
            var components = await _repository.GetComponents();
            return Ok(components);
        }

        // GET api/v1/Catalog/{id}
        [HttpGet("{id:length(24)}", Name = "GetComponent")]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(Component), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<Component>> GetComponentById(string id)
        {
            var component = await _repository.GetComponent(id);
            if (component == null)
            {
                _logger.LogError($"Component with id: {id}, not found.");
                return NotFound();
            }
            return Ok(component);
        }

        // GET api/v1/Catalog/GetByCategory/{category}
        [Route("[action]/{category}", Name = "GetByCategory")]
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Component>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<Component>>> GetByCategory(string category)
        {
            var components = await _repository.GetComponentByCategory(category);
            return Ok(components);
        }

        // POST api/v1/Catalog
        [HttpPost]
        [ProducesResponseType(typeof(Component), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<Component>> CreateComponent([FromBody] Component component)
        {
            await _repository.CreateComponent(component);

            // Return 201 Created status, linking to the newly created resource
            return CreatedAtRoute("GetComponent", new { id = component.Id }, component);
        }

        // PUT api/v1/Catalog
        [HttpPut]
        [ProducesResponseType(typeof(bool), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateComponent([FromBody] Component component)
        {
            return Ok(await _repository.UpdateComponent(component));
        }

        // DELETE api/v1/Catalog/{id}
        [HttpDelete("{id:length(24)}", Name = "DeleteComponent")]
        [ProducesResponseType(typeof(bool), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteComponentById(string id)
        {
            return Ok(await _repository.DeleteComponent(id));
        }
    }
}