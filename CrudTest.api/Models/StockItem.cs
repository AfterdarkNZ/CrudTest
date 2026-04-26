using System.ComponentModel.DataAnnotations;

namespace CrudTest.Api.Models
{
    // StockItem model represents one inventory record
    // EF Core uses this class to create the database table
    public class StockItem
    {
        // Primary key
        // EF Core recognises Id automatically
        public int Id { get; set; }

        // Required stock code
        // Example: SKU-001
        [Required]
        public string StockCode { get; set; } = string.Empty;

        // Required item description
        [Required]
        public string Description { get; set; } = string.Empty;

        // Quantity must be zero or greater
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        // Unit price must be greater than zero
        [Range(typeof(decimal), "0.01", "999999999")]
        public decimal UnitPrice { get; set; }
    }
}