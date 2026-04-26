using Microsoft.EntityFrameworkCore;
using CrudTest.Api.Models;

namespace CrudTest.Api.Data
{
    // AppDbContext is the main EF Core database context
    // It manages database access and maps models to tables
    public class AppDbContext : DbContext
    {
        // Constructor receives database options from Program.cs
        // Example: SQLite connection string
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Represents the StockItems table in the database
        // Allows querying, adding, updating and deleting stock items
        public DbSet<StockItem> StockItems => Set<StockItem>();

        // Runs when the model is first created
        // Used here to seed default sample data
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StockItem>().HasData(

                new StockItem
                {
                    Id = 1,
                    StockCode = "SKU-001",
                    Description = "Safety gloves",
                    Quantity = 150,
                    UnitPrice = 4.50M
                },

                new StockItem
                {
                    Id = 2,
                    StockCode = "SKU-002",
                    Description = "Hi-vis vest",
                    Quantity = 40,
                    UnitPrice = 12.00M
                },

                new StockItem
                {
                    Id = 3,
                    StockCode = "SKU-003",
                    Description = "Cable ties (pack)",
                    Quantity = 200,
                    UnitPrice = 2.75M
                }
            );
        }
    }
}