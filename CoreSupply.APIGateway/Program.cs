using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.AspNetCore.Hosting;

var builder = WebApplication.CreateBuilder(args);


builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);


builder.Services.AddOcelot();


builder.Services.AddControllers();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
  
    app.MapGet("/", () => "CoreSupply API Gateway is running in Development Mode.");
}


await app.UseOcelot();


app.Run();