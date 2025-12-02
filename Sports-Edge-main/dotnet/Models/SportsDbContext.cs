using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models
{
    public class SportsDbContext : DbContext
    {
        public SportsDbContext(DbContextOptions<SportsDbContext> options) : base(options) { }

        public DbSet<Sport> Sports { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<CartItems> CartItems { get; set; }
        public DbSet<WishlistItems> WishlistItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CartItems>().ToTable("cart_items");
            modelBuilder.Entity<WishlistItems>().ToTable("wishlist_items");

            base.OnModelCreating(modelBuilder);


        }
    }
}
