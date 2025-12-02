// Controllers/ProductsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models; // Import your Models namespace

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")] // Route for accessing the controller
    [ApiController]  // This attribute makes this class a Web API controller
    public class ProductsController : ControllerBase
    {
        private readonly SportsDbContext _context; // Inject DbContext

        public ProductsController(SportsDbContext context)
        {
            _context = context; // Initialize the context
        }

        // GET: api/products
        [HttpGet] // Handle GET requests to this endpoint
        public async Task<ActionResult<IEnumerable<Products>>> GetProducts()
        {
            // Fetch all products from the database
            return await _context.Products.ToListAsync();
        }
       


    }
}