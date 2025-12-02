namespace WebApplication1.Models
{
    
        public class CartItems
        {
            public int id { get; set; }

            
            public string category { get; set; }

      
            public string name { get; set; }

            
            public string img { get; set; }

            public decimal price { get; set; }

            public int UserId { get; set; }

            public int productId { get; set; }
        }
    }
