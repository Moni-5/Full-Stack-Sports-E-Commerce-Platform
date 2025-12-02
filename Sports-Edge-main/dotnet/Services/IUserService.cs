using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IUserService
    {
        User? GetUserByEmail(string email);
        bool VerifyPassword(string enteredPassword, string dbPassword);
        string Password(string password);
        void CreateUser(User user);
        User? GetUserById(int id);
        void UpdateUser(User user);
    }
}
