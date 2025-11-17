namespace CoreSupply.Catalog.API.Data
{
    // This model maps the "DatabaseSettings" section from appsettings.json
    public class DatabaseSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string CollectionName { get; set; } = string.Empty;
    }
}