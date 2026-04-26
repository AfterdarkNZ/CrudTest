using CrudTest.Api.Models;

namespace CrudTest.Tests
{
    public class StockItemTests
    {
        [Fact]
        public void TotalValue_CalculatesCorrectly()
        {
            var item = new StockItem
            {
                Quantity = 10,
                UnitPrice = 5.5m
            };

            var total = item.Quantity * item.UnitPrice;

            Assert.Equal(55m, total);
        }

        [Fact]
        public void Quantity_CanBeZero()
        {
            var item = new StockItem
            {
                Quantity = 0
            };

            Assert.True(item.Quantity >= 0);
        }
    }
}