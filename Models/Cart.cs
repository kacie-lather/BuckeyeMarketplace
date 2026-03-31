namespace BuckeyeMarketplace.API.Models
{
    public class Cart
{
    public int Id { get; set; }
    public string UserId { get; set; } = "hardcoded-user-1"; // replaced with auth in M5
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
}