// frontend/src/App.jsx

import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");

  const loadHabits = async () => {
    const res = await fetch(`${API}/habits`);
    const data = await res.json();
    setHabits(data);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const addHabit = async () => {
    if (!name.trim()) return;

    await fetch(`${API}/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    loadHabits();
  };

  const deleteHabit = async (id) => {
    await fetch(`${API}/habits/${id}`, {
      method: "DELETE",
    });

    loadHabits();
  };

  return (
    <div className="app">
      <h1>🔥 Habit Tracker</h1>

      <input
        type="text"
        placeholder="Enter habit"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={addHabit}>Add Habit</button>

      <hr />

      {habits.map((habit) => (
        <div className="habit-card" key={habit.id}>
          <h3>{habit.name}</h3>
          <p>{habit.created_at}</p>

          <button onClick={() => deleteHabit(habit.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;