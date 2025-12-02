using Microsoft.Data.SqlClient;
using WebApplication1.Models;
namespace WebApplication1.Services
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _configuration;

        public UserService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public User? GetUserByEmail(string email)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = "SELECT * FROM Users WHERE Email = @Email";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Email", email);

            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                return new User
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Username = reader["Username"].ToString()!,
                    Email = reader["Email"].ToString()!,
                    Password = reader["Password"].ToString()!,
                    Role = reader["Role"].ToString()!
                };
            }

            return null;
        }

        public bool VerifyPassword(string enteredPassword, string dbPassword)
        {
            return enteredPassword == dbPassword; // Use hashing in production
        }

        public string Password(string password)
        {
            return password; // Hash in real app
        }

        public void CreateUser(User user)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = "INSERT INTO Users (Username, Email, Password, Role) VALUES (@Username, @Email, @Password, @Role)";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Username", user.Username);
            cmd.Parameters.AddWithValue("@Email", user.Email);
            cmd.Parameters.AddWithValue("@Password", user.Password);
            cmd.Parameters.AddWithValue("@Role", user.Role);

            cmd.ExecuteNonQuery();
        }

        public User? GetUserById(int id)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = "SELECT * FROM Users WHERE Id = @Id";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);

            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                return new User
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Username = reader["Username"].ToString()!,
                    Email = reader["Email"].ToString()!,
                    Password = reader["Password"].ToString()!,
                    Role = reader["Role"].ToString()!
                };
            }
            return null;
        }

        public void UpdateUser(User user)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using var conn = new SqlConnection(connectionString);
            conn.Open();

            string query = "UPDATE Users SET Username = @Username, Email = @Email, Password = @Password, Role = @Role WHERE Id = @Id";
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Username", user.Username);
            cmd.Parameters.AddWithValue("@Email", user.Email);
            cmd.Parameters.AddWithValue("@Password", user.Password);
            cmd.Parameters.AddWithValue("@Role", user.Role);
            cmd.Parameters.AddWithValue("@Id", user.Id);

            cmd.ExecuteNonQuery();
        }
    }
}
