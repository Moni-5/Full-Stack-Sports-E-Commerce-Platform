// Controllers/ProductsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models; // Import your Models namespace

namespace WebApplication1.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class OrdersController : ControllerBase
	{
		private readonly SportsDbContext _context;

		public OrdersController(SportsDbContext context)
		{
			_context = context;
		}

		// POST api/orders
		[HttpPost]
		public async Task<IActionResult> CreateOrder([FromBody] Order order)
		{
			if (order.UserId <= 0)
				return BadRequest("Valid UserId is required");

			order.OrderDate = DateTime.UtcNow;
			_context.Orders.Add(order);
			await _context.SaveChangesAsync();

			return Ok(new { message = "Order placed successfully", orderId = order.Id });
		}


		[HttpGet("user/{userId}")]
		public async Task<IActionResult> GetOrdersByUser(string userId)
		{
			if (!int.TryParse(userId, out int parsedUserId))
				return BadRequest("Invalid user ID");

			var orders = await _context.Orders
				.Where(o => o.UserId == parsedUserId)
				.OrderByDescending(o => o.OrderDate)
				.ToListAsync();

			return Ok(orders);
		}

		[HttpPatch("{id}")]
		public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateDto updateDto)
		{
			var order = await _context.Orders.FindAsync(id);
			if (order == null)
			{
				return NotFound(new { message = "Order not found" });
			}

			order.Status = updateDto.Status;
			await _context.SaveChangesAsync();
			return Ok(new { message = $"Order status updated to {updateDto.Status}" });
		}

		// DTO for updating order status
		public class OrderStatusUpdateDto
		{
			public string Status { get; set; }
		}
	}
}
