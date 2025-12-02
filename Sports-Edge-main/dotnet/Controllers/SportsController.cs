using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace SportsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SportsController : ControllerBase
    {
        private readonly SportsDbContext _context;

        public SportsController(SportsDbContext context)
        {
            _context = context;
        }

        // GET: api/sports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sport>>> GetSports()
        {
            // Retrieve and return all sports data from the database
            return await _context.Sports.ToListAsync();
        }
    }
}
