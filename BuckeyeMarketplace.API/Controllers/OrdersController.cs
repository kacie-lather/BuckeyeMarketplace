using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BuckeyeMarketplace.API.Data;
using BuckeyeMarketplace.API.Models;
using System.Security.Claims;

namespace BuckeyeMarketplace.API.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // POST /api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.CartItems.Any())
                return BadRequest(new { message = "Cart is empty" });

            var total = cart.CartItems.Sum(ci => ci.Product.Price * ci.Quantity);
            var confirmationNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = "Confirmed",
                Total = total,
                ShippingAddress = request.ShippingAddress,
                ConfirmationNumber = confirmationNumber,
                OrderItems = cart.CartItems.Select(ci => new OrderItem
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    Price = ci.Product.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cart.CartItems);
            cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderHistory), new { id = order.Id }, new
            {
                orderId = order.Id,
                confirmationNumber = order.ConfirmationNumber,
                total = order.Total,
                status = order.Status
            });
        }

        // GET /api/orders/mine
        [HttpGet("mine")]
        public async Task<IActionResult> GetOrderHistory()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    id = o.Id,
                    orderDate = o.OrderDate,
                    status = o.Status,
                    total = o.Total,
                    shippingAddress = o.ShippingAddress,
                    confirmationNumber = o.ConfirmationNumber,
                    items = o.OrderItems.Select(oi => new
                    {
                        productId = oi.ProductId,
                        title = oi.Product.Title,
                        price = oi.Price,
                        quantity = oi.Quantity,
                        subtotal = oi.Price * oi.Quantity
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }
    }

    public class CreateOrderRequest
    {
        public string ShippingAddress { get; set; } = string.Empty;
    }
}
