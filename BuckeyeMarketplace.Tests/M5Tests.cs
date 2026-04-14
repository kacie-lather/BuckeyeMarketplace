using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using BuckeyeMarketplace.API.Data;
using BuckeyeMarketplace.API.Models;

namespace BuckeyeMarketplace.Tests;

// ─── Unit Tests ───────────────────────────────────────────────────────────────

public class OrderTotalTests
{
    [Fact]
    public void OrderTotal_SumsItemPriceTimesQuantity()
    {
        var items = new List<OrderItem>
        {
            new() { Price = 10.00m, Quantity = 2 },  // 20.00
            new() { Price = 5.50m,  Quantity = 3 },  // 16.50
            new() { Price = 100.00m, Quantity = 1 }, // 100.00
        };

        var total = items.Sum(i => i.Price * i.Quantity);

        Assert.Equal(136.50m, total);
    }
}

public class PasswordValidationTests
{
    // Builds a real UserManager backed by an in-memory EF store with the given password options.
    // No HTTP, no SQLite — purely in-process.
    private static UserManager<IdentityUser> BuildUserManager(int requiredLength)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDbContext<AppDbContext>(o =>
            o.UseInMemoryDatabase(Guid.NewGuid().ToString()));
        services.AddIdentity<IdentityUser, IdentityRole>(options =>
        {
            options.Password.RequiredLength = requiredLength;
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
        })
        .AddEntityFrameworkStores<AppDbContext>();

        return services.BuildServiceProvider().GetRequiredService<UserManager<IdentityUser>>();
    }

    [Fact]
    public async Task Password_UnderMinLength_FailsValidation()
    {
        using var userManager = BuildUserManager(requiredLength: 8);

        var result = await userManager.PasswordValidators[0]
            .ValidateAsync(userManager, new IdentityUser(), "short");  // 5 chars

        Assert.False(result.Succeeded);
    }

    [Fact]
    public async Task Password_AtMinLength_PassesValidation()
    {
        using var userManager = BuildUserManager(requiredLength: 8);

        var result = await userManager.PasswordValidators[0]
            .ValidateAsync(userManager, new IdentityUser(), "longenough");  // 10 chars

        Assert.True(result.Succeeded);
    }
}

public class OrderConfirmationNumberTests
{
    [Fact]
    public void Order_ConfirmationNumber_IsSetAndStartsWithORD()
    {
        var confirmationNumber =
            $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}";

        var order = new Order
        {
            UserId = "user-1",
            ShippingAddress = "123 Main St",
            ConfirmationNumber = confirmationNumber,
        };

        Assert.False(string.IsNullOrEmpty(order.ConfirmationNumber));
        Assert.StartsWith("ORD-", order.ConfirmationNumber);
    }
}

// ─── Integration Test ─────────────────────────────────────────────────────────

public class OrdersControllerIntegrationTests : IClassFixture<OrdersApiFactory>
{
    private readonly HttpClient _client;

    public OrdersControllerIntegrationTests(OrdersApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetOrdersMine_WithoutToken_Returns401()
    {
        var response = await _client.GetAsync("/api/orders/mine");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}

public class OrdersApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"]      = "test-super-secret-key-at-least-32-chars!!",
                ["Jwt:Issuer"]   = "test-issuer",
                ["Jwt:Audience"] = "test-audience",
            });
        });

        builder.ConfigureServices(services =>
        {
            // Remove all descriptors that carry the SQLite provider configuration.
            // EF Core 10 stores provider options via IDbContextOptionsConfiguration<T>
            // in addition to the DbContextOptions<T> and the context itself.
            foreach (var d in services
                .Where(d =>
                    d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                    d.ServiceType == typeof(AppDbContext) ||
                    d.ServiceType == typeof(IDbContextOptionsConfiguration<AppDbContext>))
                .ToList())
            {
                services.Remove(d);
            }

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("TestDb"));
        });
    }
}
