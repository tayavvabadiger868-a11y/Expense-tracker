# 💰 Expense Tracker

A full-stack Expense Tracker application built with **Express.js**, **SQLite (better-sqlite3)**, and **React + Vite**. This project allows users to record daily expenses, filter them by category, view monthly summaries, and manage expenses through a REST API.

---

# Features

## Backend

* Express REST API
* SQLite database using better-sqlite3
* CORS enabled for frontend communication
* Automatic database and table creation
* Create, Read, Update, Delete (CRUD) operations
* Pagination support
* Category filtering
* Monthly filtering
* Monthly expense summary grouped by category

## Frontend

* Add new expenses
* Expense validation
* Monthly summary with horizontal bars
* Category filter
* Pagination
* Delete expenses
* Responsive card-based UI
* Loading states
* Empty state messages

---

# Project Structure

```text
project-folder/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   └── data.db (created automatically)
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    │
    └── package.json
```

---

# Technologies Used

### Backend

* Node.js
* Express.js
* better-sqlite3
* SQLite
* CORS

### Frontend

* React
* Vite
* CSS

---

# Expense Table

The application automatically creates the following SQLite table.

| Column     | Type                              |
| ---------- | --------------------------------- |
| id         | INTEGER PRIMARY KEY AUTOINCREMENT |
| title      | TEXT                              |
| amount     | REAL                              |
| category   | TEXT                              |
| date       | TEXT                              |
| created_at | TEXT                              |

---

# Expense Categories

* Food
* Transport
* Bills
* Entertainment
* Other

---

# REST API

## Add Expense

**POST**

```
/expenses
```

Example Request

```json
{
  "title": "Groceries",
  "amount": 450.50,
  "category": "Food",
  "date": "2026-07-06"
}
```

---

## Get Expenses

**GET**

```
/expenses
```

Optional Query Parameters

```
?page=1
&limit=10
&category=Food
&month=2026-07
```

---

## Monthly Summary

**GET**

```
/expenses/summary
```

Example

```
/expenses/summary?month=2026-07
```

---

## Update Expense

**PUT**

```
/expenses/:id
```

---

## Delete Expense

**DELETE**

```
/expenses/:id
```

---

# Running the Backend

Open a terminal.

```bash
cd backend
```

Start the server.

```bash
node index.js
```

Server runs at

```
http://localhost:5000
```

---

# Running the Frontend

Open another terminal.

```bash
cd frontend
```

Start the Vite development server.

```bash
npm run dev
```

The frontend will usually open at

```
http://localhost:5173
```

---

# Application Workflow

1. Start the backend.
2. Start the frontend.
3. Add an expense.
4. View all expenses.
5. Filter expenses by category.
6. Navigate through pages.
7. View monthly summary.
8. Delete or edit expenses.
9. Data is automatically stored in the SQLite database.

---

# Validation Rules

* Title is required.
* Amount must be greater than zero.
* Category is required.
* Date is required.

---

# Pagination

The expense list supports pagination.

* Previous page
* Next page
* Current page indicator
* Total pages

---

# Monthly Summary

The summary page displays:

* Total spending by category
* Horizontal progress bars
* Grand total for the selected month

---

# Screens

* Add Expense Form
* Monthly Summary
* Expense List
* Category Filter
* Pagination Controls

---

# Future Improvements

* Expense editing popup
* Search expenses
* Export to CSV
* Export to PDF
* Charts using Chart.js
* Dark mode
* Budget limits
* User authentication
* Expense analytics

---

# Author

Expense Tracker Project

Built using **Express.js**, **SQLite**, **React**, and **Vite**.
