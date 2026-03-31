using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BuckeyeMarketplace.API.Data;
using BuckeyeMarketplace.API.Models;

namespace BuckeyeMarketplace.API.Controllers
{
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const string CurrentUserId = "hardcoded-user-1";

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

            if (cart == null) return NotFound(new { message = "Cart is empty" });

            var response = new
            {
                id = cart.Id,
                items = cart.CartItems.Select(ci => new
                {
                    cartItemId = ci.Id,
                    productId = ci.ProductId,
                    title = ci.Product.Title,
                    price = ci.Product.Price,
                    imageUrl = ci.Product.ImageUrl,
                    quantity = ci.Quantity,
                    subtotal = ci.Product.Price * ci.Quantity
                }),
                total = cart.CartItems.Sum(ci => ci.Product.Price * ci.Quantity),
                itemCount = cart.CartItems.Sum(ci => ci.Quantity)
            };

            return Ok(response);
        }

        // POST /api/cart
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            if (request.Quantity < 1)
                return BadRequest(new { message = "Quantity must be at least 1" });

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            // Find or create cart
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

            if (cart == null)
            {
                cart = new Cart { UserId = CurrentUserId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            // Upsert: if item already in cart, increment quantity
            var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _context.CartItems.Add(newItem);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCart), null);
        }

        // PUT /api/cart/{cartItemId}
        [HttpPut("{cartItemId}")]
        public async Task<IActionResult> UpdateQuantity(int cartItemId, [FromBody] UpdateCartItemRequest request)
        {
            if (request.Quantity < 1)
                return BadRequest(new { message = "Quantity must be at least 1" });

            var item = await _context.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.Cart.UserId == CurrentUserId);

            if (item == null) return NotFound(new { message = "Cart item not found" });

            item.Quantity = request.Quantity;
            item.Cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { cartItemId = item.Id, quantity = item.Quantity });
        }

        // DELETE /api/cart/clear  (must come BEFORE /{cartItemId} route)
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

            if (cart == null) return NotFound(new { message = "Cart not found" });

            _context.CartItems.RemoveRange(cart.CartItems);
            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE /api/cart/{cartItemId}
        [HttpDelete("{cartItemId}")]
        public async Task<IActionResult> RemoveItem(int cartItemId)
        {
            var item = await _context.CartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId && ci.Cart.UserId == CurrentUserId);

            if (item == null) return NotFound(new { message = "Cart item not found" });

            _context.CartItems.Remove(item);
            item.Cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
