using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistItemsController : ControllerBase
    {
        private readonly SportsDbContext _context;

        public WishlistItemsController(SportsDbContext context)
        {
            _context = context;
        }

        // ? Get all wishlist items for a user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<WishlistItems>>> GetWishlistItemsByUserId(int userId)
        {
            return await _context.WishlistItems
                                 .Where(w => w.UserId == userId)
                                 .ToListAsync();
        }

        // ? Post a wishlist item with UserId
        [HttpPost("user/{userId}")]
        public async Task<ActionResult<WishlistItems>> PostWishlistItem(int userId, [FromBody] WishlistItems item)
        {
            item.UserId = userId; // Force UserId from URL
            _context.WishlistItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWishlistItemsByUserId), new { userId = userId }, item);
        }

        // ? Delete a wishlist item for a specific user by productId
        [HttpDelete("user/{userId}/product/{productId}")]
        public async Task<IActionResult> DeleteWishlistItem(int userId, int productId)
        {
            var item = await _context.WishlistItems
                                     .FirstOrDefaultAsync(x => x.UserId == userId && x.productId == productId);

            if (item == null)
                return NotFound();

            _context.WishlistItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
