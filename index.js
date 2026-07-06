// backend/index.js

const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("data.db");

app.use(cors());
app.use(express.json());

// Create table
db.prepare(`
CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT
)
`).run();

// Get all habits
app.get("/habits", (req, res) => {
    const habits = db.prepare("SELECT * FROM habits").all();
    res.json(habits);
});

// Add habit
app.post("/habits", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name required" });
    }

    const created_at = new Date().toISOString();

    const result = db.prepare(
        "INSERT INTO habits(name, created_at) VALUES (?, ?)"
    ).run(name, created_at);

    res.json({
        id: result.lastInsertRowid,
        name,
        created_at,
    });
});

// Delete habit
app.delete("/habits/:id", (req, res) => {
    db.prepare("DELETE FROM habits WHERE id=?").run(req.params.id);
    res.json({ message: "Habit deleted" });
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});