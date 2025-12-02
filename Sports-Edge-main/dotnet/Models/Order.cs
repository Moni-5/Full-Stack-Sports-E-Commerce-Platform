namespace WebApplication1.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductImage { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }

        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string Pincode { get; set; }
        public string DeliveryType { get; set; }

        public string PaymentMethod { get; set; }
        public string Status { get; set; }
        public DateTime OrderDate { get; set; }
    }

}