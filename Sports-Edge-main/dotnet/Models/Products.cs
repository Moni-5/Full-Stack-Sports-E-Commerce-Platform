namespace WebApplication1.Models
{
    public class Products
    {
        public int id { get; set; }              // Primary key
        public required string category { get; set; }     // Category of the equipment
        public required string name { get; set; }         // Name of the equipment
        public required string img { get; set; }          // Image URL or path for the equipment
        public int stars { get; set; }           // Rating stars (assumed to be an integer)
        public int price { get; set; }           // Price of the equipment
        public required string cart_status { get; set; } // Cart status
        public required string wishlist_status { get; set; }

    }
}
