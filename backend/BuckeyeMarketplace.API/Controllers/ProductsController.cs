using Microsoft.AspNetCore.Mvc;
using BuckeyeMarketplace.API.Models;

namespace BuckeyeMarketplace.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private static readonly List<Product> _products = new()
        {
            new Product { Id = 1, Title = "Hand-Dyed Scarlet Tie-Dye Crewneck", Description = "Hand-dyed OSU scarlet and gray crewneck sweatshirt. Made-to-order, one of a kind. Unisex sizing, runs slightly oversized. Machine wash cold.", Price = 38.00m, Category = "Outfits", SellerName = "AlexDesigns", PostedDate = DateTime.Now.AddDays(-25), ImageUrl = "/images/Sweatshirt.png" },
            new Product { Id = 2, Title = "Upcycled Denim Jacket — Block O Back", Description = "Thrifted denim jacket with hand-painted OSU Block O on the back using fabric paint. Size M. Truly one of a kind — no two are the same.", Price = 55.00m, Category = "Outfits", SellerName = "AlexDesigns", PostedDate = DateTime.Now.AddDays(-20), ImageUrl = "/images/Jacket.png" },
            new Product { Id = 3, Title = "Crocheted Scarlet Bucket Hat", Description = "Hand-crocheted bucket hat in OSU scarlet. Stretchy and fits most head sizes. Perfect for game days or everyday wear.", Price = 22.00m, Category = "Accessories", SellerName = "YarnByJess", PostedDate = DateTime.Now.AddDays(-17), ImageUrl = "/images/Hat.png" },
            new Product { Id = 4, Title = "Custom Graphic Tank — 'Made in Columbus'", Description = "Original design screen-printed on a Bella Canvas tank. Unisex sizing S–XL. Soft, lightweight fabric. Great for class or the gym.", Price = 18.00m, Category = "Tanks", SellerName = "AlexDesigns", PostedDate = DateTime.Now.AddDays(-15), ImageUrl = "/images/Tank.png" },
            new Product { Id = 5, Title = "OSU Campus Sticker Pack (10 Stickers)", Description = "Set of 10 original hand-drawn vinyl stickers — Brutus, the Horseshoe, coffee cups, and campus scenes. Waterproof and laptop-safe.", Price = 8.00m, Category = "Stickers", SellerName = "DoodlesByKayla", PostedDate = DateTime.Now.AddDays(-9), ImageUrl = "/images/Stickers.png" },
            new Product { Id = 6, Title = "Chunky Arm-Knit Throw Blanket", Description = "Arm-knitted chunky blanket in cream and gray. Super cozy for dorm nights or studying. Approx 40\" x 50\". Makes a great gift — perfect for care packages!", Price = 65.00m, Category = "Blankets", SellerName = "KnottyByNature", PostedDate = DateTime.Now.AddDays(-7), ImageUrl = "/images/blanket.jpeg"},
            new Product { Id = 7, Title = "Pleated Mini Skirt — OSU Gray", Description = "Hand-sewn pleated mini skirt in heather gray. Elastic waistband, size S/M. Pairs perfectly with a scarlet tank or crewneck for game day.", Price = 28.00m, Category = "Skirts", SellerName = "MadisonCrafts", PostedDate = DateTime.Now.AddDays(-5), ImageUrl = "/images/Skirt.png" },
            new Product { Id = 8, Title = "Pressed Flower Resin Bookmark Set", Description = "Set of 3 handmade resin bookmarks with real pressed flowers. Glossy finish, gold ribbon tassel. Cute dorm desk accessory or gift idea.", Price = 12.00m, Category = "Accessories", SellerName = "BloomByBri", PostedDate = DateTime.Now.AddDays(-3), ImageUrl = "/images/Bookmark.png" },
        };

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }
    }
}