// Base URL for all stock item API requests
// Points to the ASP.NET Core backend running locally
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/items";

// GET all stock items
export async function getItems() {
  const response = await fetch(API_BASE_URL);

  // Throw error if request failed
  if (!response.ok) throw new Error("Failed to load items");

  // Convert JSON response into JavaScript data
  return response.json();
}

// GET total stock value summary
export async function getStockValue() {
  const response = await fetch(`${API_BASE_URL}/value`);

  if (!response.ok) throw new Error("Failed to load stock value");

  return response.json();
}

// POST create a new stock item
export async function createItem(item) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(item),
  });

  if (!response.ok) throw new Error("Failed to create item");

  return response.json();
}

// PUT update an existing stock item
export async function updateItem(id, item) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(item),
  });

  if (!response.ok) throw new Error("Failed to update item");
}

// DELETE a stock item by ID
export async function deleteItem(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete item");
}
