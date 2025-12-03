using CoreSupply.Catalog.API.Data;
using CoreSupply.Catalog.API.Repositories;
using CoreSupply.Catalog.API.Repositories; // For IComponentRepository and ComponentRepository
using Microsoft.Extensions.Configuration; // Ensure this is present
using CoreSupply.BuildingBlocks.Logging;




var builder = WebApplication.CreateBuilder(args);
builder.AddCustomSerilog();



// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// 1. Configure the Options Pattern
// This binds the "DatabaseSettings" section from appsettings.json to the DatabaseSettings C# class.
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings")
);

// 2. Register the Repository service.
// We use AddScoped, as this is the standard for services that interact with the database 
// within the scope of a single request.
builder.Services.AddScoped<IComponentRepository, ComponentRepository>();








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
