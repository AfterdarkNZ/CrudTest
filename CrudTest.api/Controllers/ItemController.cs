using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CrudTest.Api.Data;
using CrudTest.Api.Models;

namespace CrudTest.Api.Controllers
{
    // Marks this class as an API controller
    // Enables automatic model validation and API behaviour
    [ApiController]

    // Base route for all endpoints in this controller
    // Example: /api/items
    [Route("api/items")]
    public class ItemsController : ControllerBase
    {
        // Database context used to access StockItems table
        private readonly AppDbContext _context;

        // Dependency injection provides AppDbContext
        public ItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/items
        // Returns all stock items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockItem>>> GetAll()
        {
            return await _context.StockItems.ToListAsync();
        }

        // GET /api/items/{id}
        // Returns a single stock item by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<StockItem>> GetById(int id)
        {
            var item = await _context.StockItems.FindAsync(id);

            // Return 404 if item not found
            if (item == null)
                return NotFound();

            return item;
        }

        // POST /api/items
        // Creates a new stock item
        [HttpPost]
        public async Task<ActionResult<StockItem>> Create(StockItem item)
{
    var newCode = item.StockCode.Trim().ToLower();

    var exists = await _context.StockItems.AnyAsync(x =>
        x.StockCode.ToLower() == newCode);

    if (exists)
        return BadRequest("Stock code already exists.");

    _context.StockItems.Add(item);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
}

        

        // PUT /api/items/{id}
        // Updates an existing stock item
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, StockItem item)
        {
            // URL id must match body id
            if (id != item.Id)
                return BadRequest();

            // Check item exists before updating
            var exists = await _context.StockItems.AnyAsync(x => x.Id == id);

            if (!exists)
                return NotFound();
                
                var duplicateCode = await _context.StockItems.AnyAsync(x =>
    x.Id != id &&
    x.StockCode.ToLower() == item.StockCode.ToLower());

if (duplicateCode)
{
    return BadRequest("Stock code already exists.");
}

            // Mark entity as modified
            _context.Entry(item).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // 204 = successful update, no content returned
            return NoContent();
        }

        // DELETE /api/items/{id}
        // Deletes a stock item
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.StockItems.FindAsync(id);

            if (item == null)
                return NotFound();

            _context.StockItems.Remove(item);
            await _context.SaveChangesAsync();

            // 204 = deleted successfully
            return NoContent();
        }

        // GET /api/items/value
        // Returns total stock value and item count
        [HttpGet("value")]
        public async Task<IActionResult> GetValue()
        {
            var items = await _context.StockItems.ToListAsync();

            // Total = Quantity × UnitPrice for each item
            var total = items.Sum(x => x.Quantity * x.UnitPrice);

            return Ok(new
            {
                totalValue = total,
                itemCount = items.Count
            });
        }
    }
}