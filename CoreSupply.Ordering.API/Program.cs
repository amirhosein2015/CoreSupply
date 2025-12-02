using CoreSupply.Ordering.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MassTransit;
using CoreSupply.Ordering.API.EventBusConsumer;

var builder = WebApplication.CreateBuilder(args);

// --- Add services to the container ---

// 1. API Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Database Configuration (SQL Server)
builder.Services.AddDbContext<OrderContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("OrderingConnectionString")));

// 3. MediatR (CQRS)
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// 4. MassTransit Configuration (RabbitMQ Consumer)
builder.Services.AddMassTransit(config => {
    // معرفی Consumer برای دریافت پیام‌ها
    config.AddConsumer<BasketCheckoutConsumer>();

    config.UsingRabbitMq((ctx, cfg) => {
        cfg.Host("amqp://guest:guest@core.eventbus:5672");

        // تنظیم دقیق صف و بایندینگ
        cfg.ReceiveEndpoint("basket-checkout-queue", c => {
            // این خط حیاتی است: میگوید این صف باید پیام‌های این نوع ایونت را بگیرد
            c.ConfigureConsumer<BasketCheckoutConsumer>(ctx);
        });
    });

});

var app = builder.Build();

// --- Pipeline ---

// اعمال خودکار مایگریشن‌ها هنگام استارت برنامه
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<OrderContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();
