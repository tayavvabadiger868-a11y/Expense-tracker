// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000';
const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

// Formats a number as an Indian Rupee amount, e.g. 1200.5 -> "₹1,200.50"
function formatCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Formats an ISO date string as a readable date, e.g. "2026-07-06" -> "Jul 6, 2026"
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Returns today's date as "YYYY-MM-DD"
function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

// Returns the current month as "YYYY-MM"
function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function App() {
  // ---------- Add-expense form state ----------
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(getTodayDate());
  const [formError, setFormError] = useState('');

  // ---------- Summary state ----------
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // ---------- Expense list state ----------
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetches one page of expenses, respecting the current category filter
  const fetchExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const params = new URLSearchParams({ page, limit: 5 });
      if (categoryFilter) params.append('category', categoryFilter);

      const res = await fetch(`${API_URL}/expenses?${params.toString()}`);
      const data = await res.json();
      setExpenses(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load expenses', err);
    }
    setLoadingExpenses(false);
  };

  // Fetches the category-wise summary for the selected month
  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch(`${API_URL}/expenses/summary?month=${selectedMonth}`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load summary', err);
    }
    setLoadingSummary(false);
  };

  // Load the expense list whenever the page or category filter changes
  useEffect(() => {
    fetchExpenses();
  }, [page, categoryFilter]);

  // Load the summary whenever the selected month changes
  useEffect(() => {
    fetchSummary();
  }, [selectedMonth]);

  // Handles submitting the "Add Expense" form
  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !amount || Number(amount) <= 0) {
      setFormError('Please enter a title and a valid amount.');
      return;
    }

    try {
      await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          category,
          date,
        }),
      });

      setTitle('');
      setAmount('');
      setPage(1);
      await fetchExpenses();
      await fetchSummary();
    } catch (err) {
      console.error('Failed to add expense', err);
    }
  };

  // Handles deleting an expense row
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
      await fetchExpenses();
      await fetchSummary();
    } catch (err) {
      console.error('Failed to delete expense', err);
    }
  };

  // Handles changing the category filter dropdown
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  // Finds the highest category total, used to scale the summary bars
  const maxCategoryTotal =
    summary && summary.categories.length > 0
      ? Math.max(...summary.categories.map((c) => c.total))
      : 0;

  return (
    <div className="app">
      <h1>💰 Expense Tracker</h1>

      {/* ---------- Add expense form ---------- */}
      <div className="card">
        <h2>Add Expense</h2>
        <form onSubmit={handleAddExpense} className="expense-form">
          <input
            type="text"
            placeholder="What did you spend on?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button type="submit" className="btn btn-primary">
            Add Expense
          </button>
          {formError && <p className="form-error">{formError}</p>}
        </form>
      </div>

      {/* ---------- Monthly summary ---------- */}
      <div className="card">
        <h2>Monthly Summary</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-picker"
        />

        {loadingSummary ? (
          <p className="loading">Loading summary...</p>
        ) : !summary || summary.categories.length === 0 ? (
          <p className="empty">No expenses recorded for this month.</p>
        ) : (
          <>
            <div className="summary-bars">
              {summary.categories.map((c) => (
                <div key={c.category} className="summary-row">
                  <div className="summary-label">
                    <span>{c.category}</span>
                    <span>{formatCurrency(c.total)}</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(c.total / maxCategoryTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="grand-total">Total: {formatCurrency(summary.grandTotal)}</p>
          </>
        )}
      </div>

      {/* ---------- Expense list ---------- */}
      <div className="card">
        <h2>All Expenses</h2>
        <select
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {loadingExpenses ? (
          <p className="loading">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="empty">No expenses found.</p>
        ) : (
          <ul className="expense-list">
            {expenses.map((exp) => (
              <li key={exp.id} className="expense-row">
                <div className="expense-info">
                  <span className="expense-title">{exp.title}</span>
                  <span className="category-pill">{exp.category}</span>
                </div>
                <span className="expense-amount">{formatCurrency(exp.amount)}</span>
                <span className="expense-date">{formatDate(exp.date)}</span>
                <button className="btn btn-danger" onClick={() => handleDelete(exp.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="btn btn-secondary"
          >
            ◀ Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="btn btn-secondary"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;