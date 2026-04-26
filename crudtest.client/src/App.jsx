import {useCallback, useEffect, useState} from "react";
import {createItem, deleteItem, getItems, getStockValue, updateItem} from "./api/itemsApi";
import {toast, ToastContainer} from "react-toastify";

const emptyForm = {
  stockCode: "",
  description: "",
  quantity: 0,
  unitPrice: 0,
};

export default function App() {
  // Stores all stock items from API
  const [items, setItems] = useState([]);

  // Stores stock value summary
  const [stockValue, setStockValue] = useState(null);

  // Stores form inputs for add/edit
  const [form, setForm] = useState(emptyForm);

  // If set, user is editing an existing item
  const [editingId, setEditingId] = useState(null);

  // Displays error messages to user
  const [error, setError] = useState("");

  // Loads items + stock summary from backend
  const loadData = useCallback(async () => {
    try {
      const [itemsData, valueData] = await Promise.all([getItems(), getStockValue()]);

      setItems(itemsData);
      setStockValue(valueData);
      setError("");
    } catch {
      setError("Could not connect to API.");
    }
  }, []);

  // Runs once when page loads
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [loadData]);

  // Updates form values as user types
  function handleChange(event) {
    const {name, value} = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "quantity" || name === "unitPrice" ? Number(value) : value,
    }));
  }

  // Clears form and exits edit mode
  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  // Loads selected row into form for editing
  function startEdit(item) {
    setEditingId(item.id);

    setForm({
      stockCode: item.stockCode,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
  }

  // Handles add or update submit
  async function handleSubmit(event) {
    event.preventDefault();

    // Basic frontend validation
    if (!form.stockCode.trim() || !form.description.trim()) {
      setError("Stock code and description required.");
      return;
    }

    if (form.quantity < 0) {
      setError("Quantity must be 0 or greater.");
      return;
    }

    if (form.unitPrice <= 0) {
      setError("Unit price must be greater than 0.");
      return;
    }

    try {
      if (editingId) {
        await updateItem(editingId, {
          id: editingId,
          ...form,
        });

        toast.success("Item updated.");
      } else {
        await createItem(form);

        toast.success("Item added.");
      }

      resetForm();
      await loadData();
    } catch {
      toast.error("Stock code already exists.");
    }
  }

  // Deletes selected item
  async function confirmDelete(id) {
    toast(
      ({closeToast}) => (
        <div className="space-y-3">
          <p className="font-semibold text-slate-800">Are you sure?</p>

          <p className="text-sm text-slate-500">This cannot be undone.</p>

          <div className="flex gap-2 pt-2">
            <button
              className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
              onClick={async () => {
                closeToast();

                try {
                  await deleteItem(id);
                  toast.success("Item deleted.");
                  await loadData();
                } catch {
                  toast.error("Delete failed.");
                }
              }}
            >
              Delete
            </button>

            <button className="bg-slate-500 text-white px-3 py-2 rounded-lg text-sm" onClick={closeToast}>
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
      },
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={2500} />
      <div className="min-h-screen bg-slate-100 text-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold">Stock Manager</h1>
              <p className="text-slate-500 mt-1">ASP.NET Core + EF Core + React CRUD App</p>
            </div>

            {/* Stock value summary card */}
            {stockValue && (
              <div className="bg-white rounded-2xl shadow px-6 py-4 min-w-60">
                <p className="text-sm text-slate-500">Total Stock Value</p>
                <p className="text-3xl font-bold text-blue-600">${stockValue.totalValue.toFixed(2)}</p>
                <p className="text-sm text-slate-500">{stockValue.itemCount} items</p>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && <div className="mb-6 rounded-xl bg-red-100 border border-red-300 text-red-700 px-4 py-3">{error}</div>}

          {/* Add / Edit Form */}
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-5">{editingId ? "Edit Item" : "Add Item"}</h2>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                name="stockCode"
                placeholder="Stock Code"
                value={form.stockCode}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />

              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="number"
                step="0.01"
                name="unitPrice"
                placeholder="Unit Price"
                value={form.unitPrice}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />

              <div className="lg:col-span-4 flex gap-3 pt-2">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium">
                  {editingId ? "Save Changes" : "Add Item"}
                </button>

                {/* Cancel only shown in edit mode */}
                {editingId && (
                  <button type="button" onClick={resetForm} className="bg-slate-500 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-medium">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Stock table */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-2xl font-semibold">Current Stock</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr className="text-left">
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {[...items]
                    .sort((a, b) => a.stockCode.localeCompare(b.stockCode))
                    .map((item) => (
                      <tr key={item.id} className="border-t hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-medium">{item.stockCode}</td>

                        <td className="px-4 py-3">{item.description}</td>

                        <td className="px-4 py-3">{item.quantity}</td>

                        <td className="px-4 py-3">${item.unitPrice.toFixed(2)}</td>

                        <td className="px-4 py-3 font-semibold text-blue-600">${(item.quantity * item.unitPrice).toFixed(2)}</td>

                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(item)}
                              className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => confirmDelete(item.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* Empty state */}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-slate-500">
                        No items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
