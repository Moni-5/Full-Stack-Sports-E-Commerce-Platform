using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly JwtService _jwtService;
        private readonly SportsDbContext _context;

        public AuthController(IUserService userService, JwtService jwtService, SportsDbContext context)
        {
            _userService = userService;
            _jwtService = jwtService;
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        // PUT: api/auth/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePassword(int id, [FromBody] User updatedUser)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.Password = updatedUser.Password; // Hash it here if needed
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully" });
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _userService.GetUserByEmail(request.Email);

            if (user == null || !_userService.VerifyPassword(request.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                token = token,
                username = user.Username,
                role = user.Role,
                userId = user.Id  
            });

        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var existingUser = _userService.GetUserByEmail(request.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                Password = _userService.Password(request.Password),
                Role = "User"
            };

            _userService.CreateUser(newUser);

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var user = _userService.GetUserById(request.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            if (!_userService.VerifyPassword(request.CurrentPassword, user.Password))
            {
                return BadRequest(new { message = "Current password is incorrect" });
            }
            user.Password = _userService.Password(request.NewPassword); // Hash if needed
            _userService.UpdateUser(user);
            return Ok(new { message = "Password updated successfully" });
        }

        public class ChangePasswordRequest
        {
            public int UserId { get; set; }
            public string CurrentPassword { get; set; } = string.Empty;
            public string NewPassword { get; set; } = string.Empty;
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}