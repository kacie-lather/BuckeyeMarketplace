using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BuckeyeMarketplace.API.Data;
using BuckeyeMarketplace.API.Models;

namespace BuckeyeMarketplace.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const string HardcodedUserId = "hardcoded-user-1";

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var cart = await GetOrCreateCartAsync();
            await _context.Entry(cart)
                .Collection(c => c.CartItems)
                .Query()
                .Include(ci => ci.Product)
                .LoadAsync();

            return Ok(cart);
        }

        // POST /api/cart
        [HttpPost]
        public async Task<IActionResult> AddItem([FromBody] AddCartItemDto dto)
        {
            if (dto.Quantity < 1)
                return BadRequest("Quantity must be at least 1.");

            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
                return NotFound("Product not found.");

            var cart = await GetOrCreateCartAsync();
            await _context.Entry(cart)
                .Collection(c => c.CartItems)
                .LoadAsync();

            var existing = cart.CartItems.FirstOrDefault(ci => ci.ProductId == dto.ProductId);
            if (existing != null)
            {
                existing.Quantity += dto.Quantity;
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };
                _context.CartItems.Add(newItem);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCart), null, cart);
        }

        // PUT /api/cart/{cartItemId}
        [HttpPut("{cartItemId}")]
        public async Task<IActionResult> UpdateQuantity(int cartItemId, [FromBody] UpdateCartItemDto dto)
        {
            if (dto.Quantity < 1)
                return BadRequest("Quantity must be at least 1.");

            var item = await _context.CartItems.FindAsync(cartItemId);
            if (item == null)
                return NotFound("Cart item not found.");

            item.Quantity = dto.Quantity;
            await _context.SaveChangesAsync();

            return Ok(item);
        }

        // DELETE /api/cart/clear  ← must be before {cartItemId} to avoid route conflict
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var cart = await GetOrCreateCartAsync();
            await _context.Entry(cart)
                .Collection(c => c.CartItems)
                .LoadAsync();

            _context.CartItems.RemoveRange(cart.CartItems);
            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart cleared." });
        }

        // DELETE /api/cart/{cartItemId}
        [HttpDelete("{cartItemId}")]
        public async Task<IActionResult> RemoveItem(int cartItemId)
        {
            var item = await _context.CartItems.FindAsync(cartItemId);
            if (item == null)
                return NotFound("Cart item not found.");

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item removed." });
        }

        private async Task<Cart> GetOrCreateCartAsync()
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == HardcodedUserId);

            if (cart == null)
            {
                cart = new Cart { UserId = HardcodedUserId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return cart;
        }
    }

    public record AddCartItemDto(int ProductId, int Quantity);
    public record UpdateCartItemDto(int Quantity);
}
