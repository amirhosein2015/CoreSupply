using CoreSupply.IntegrationTests.Fixtures;
using CoreSupply.Ordering.API.Application.Commands;
using CoreSupply.Ordering.API.Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Json;
using CoreSupply.IntegrationTests.Fixtures;

namespace CoreSupply.IntegrationTests.Fixtures
{
    public class OrderTests : IClassFixture<IntegrationTestWebAppFactory>
    {
        private readonly IntegrationTestWebAppFactory _factory;

        public OrderTests(IntegrationTestWebAppFactory factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task CreateOrder_Should_Save_To_Database()
        {
            // Arrange (چیدمان)
            var client = _factory.CreateClient();
            var command = new CreateOrderCommand
            {
                UserName = "TestUser",
                TotalPrice = 1000,
                FirstName = "Test",
                LastName = "User",
                EmailAddress = "test@test.com",
                AddressLine = "Test St",
                Country = "TestLand",
                State = "Tehran",
                ZipCode = "12345",
                CardName = "Visa",
                CardNumber = "1234123412341234",
                Expiration = "12/25",
                CVV = "123",
                PaymentMethod = 1
            };

            // Act (اجرا)
            var response = await client.PostAsJsonAsync("/api/v1/Order", command);

            // Assert (بررسی نتیجه)
            response.EnsureSuccessStatusCode(); 

            // بررسی دیتابیس (Direct Database Check)
            using var scope = _factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<CoreSupply.Ordering.API.Infrastructure.Persistence.OrderContext>();

            var createdOrder = await context.Orders.FirstOrDefaultAsync(o => o.UserName == "TestUser");

            createdOrder.Should().NotBeNull(); // سفارش باید پیدا شود
            createdOrder!.TotalPrice.Should().Be(1000); // قیمت باید درست باشد
        }
    }
}
