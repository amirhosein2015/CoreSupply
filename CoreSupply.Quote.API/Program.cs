using CoreSupply.Quote.API.Repositories;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// --- Redis Configuration for Caching/Basket ---
builder.Services.AddStackExchangeRedisCache(options =>
{
    // Retrieve the connection string from appsettings.json
    options.Configuration = builder.Configuration.GetValue<string>("CacheSettings:ConnectionString");
});

// --- Dependency Injection for Repositories ---
builder.Services.AddScoped<IBasketRepository, BasketRepository>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();