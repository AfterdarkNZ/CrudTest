# CrudTest – Stock Manager CRUD Application

Take-home technical test built with:

- ASP.NET Core 10 Web API
- Entity Framework Core
- SQLite
- React (Vite)
- Tailwind CSS
- xUnit Tests

---

## Features

### Backend API

Supports full CRUD operations for Stock Items:

- GET `/api/items`
- GET `/api/items/{id}`
- POST `/api/items`
- PUT `/api/items/{id}`
- DELETE `/api/items/{id}`

### Additional Endpoint

- GET `/api/items/value`

Returns total stock value calculated from:

`Quantity × UnitPrice`

---

## Validation

Implemented business rules:

- StockCode is required
- Description is required
- Quantity must be 0 or greater
- UnitPrice must be greater than 0
- Duplicate StockCodes are prevented

---

## Frontend UI

Simple React frontend allows users to:

- View all stock items
- Add items
- Edit items
- Delete items
- View total stock value

Additional UI Personal Improvements:

- Toast notifications
- Delete confirmation prompt
- Automatic alphabetical sorting by StockCode

---

## Tests

Separate xUnit test project included with 2 passing unit tests.

---

## How to Run

## Backend

Open terminal in:

```bash
crudtest.api
```

Run:

```bash
dotnet run
```

Backend runs on:

```text
http://localhost:5190
```

Swagger available at:

```text
http://localhost:5190/swagger
```

---

## Frontend

Open second terminal in:

```bash
crudtest.client
```

Run:

```bash
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Azure Deployed Live Demo

```text
https://gray-pebble-0f7aba60f.7.azurestaticapps.net/
```

## Decision Note

I chose SQLite for the database because it keeps setup simple while still using a real relational database. This allowed the application to be easy to run locally without requiring SQL Server or additional configuration.

I chose React for the frontend because it is a framework I am comfortable with, allowing me to focus time on backend API functionality and overall usability.

---

## Author

Pete Mackay
