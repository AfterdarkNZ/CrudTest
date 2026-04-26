using Microsoft.EntityFrameworkCore;
using CrudTest.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Adds support for API controllers
builder.Services.AddControllers();

// Registers AppDbContext with SQLite database
// stock.db will be created locally if it does not already exist
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=stock.db"));

// Adds Swagger/OpenAPI support for testing API endpoints in the browser
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Allows the React frontend to call this API during local development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:5173",
                "https://gray-pebble-0f7aba60f.7.azurestaticapps.net/"
)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Enables Swagger in Azure also


    app.UseSwagger();
    app.UseSwaggerUI();


// Applies the CORS policy defined above
app.UseCors("AllowReact");

// Disabled for local testing because this app is running on HTTP only
// app.UseHttpsRedirection();

// Maps controller routes such as /api/items
app.MapControllers();

// Creates the database and applies seeded data if needed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.Run();