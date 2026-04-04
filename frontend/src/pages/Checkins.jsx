import { useState, useEffect } from "react";
import axios from "axios";

export default function Checkins() {
  const token = localStorage.getItem("token");

  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState([]);

  const API = "http://localhost:5000/api";

  // fetch history
  useEffect(() => {
    const fetchCheckins = async () => {
      const res = await axios.get(`${API}/checkins/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.checkins);
    };
    fetchCheckins();
  }, []);

  // submit
  const handleSubmit = async () => {
    await axios.post(
      `${API}/checkins`,
      { weight, notes },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Check-in saved");

    setWeight("");
    setNotes("");

    // refresh
    const res = await axios.get(`${API}/checkins/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHistory(res.data.checkins);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Weekly Check-in</h2>

        <input
          type="number"
          placeholder="Enter weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
        />

        <button style={styles.button} onClick={handleSubmit}>
          Save Check-in
        </button>

        <h3 style={styles.subTitle}>Recent Check-ins</h3>

        {history.map((c) => (
          <div key={c._id} style={styles.historyItem}>
            <p>📅 {c.date}</p>
            <p>⚖️ {c.weight} kg</p>
            <p>{c.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🌙 styles (same theme)
const styles = {
  container: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    color: "#fff",
  },

  card: {
    background: "#0f172a",
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.6)",
    border: "1px solid #22c55e",
  },

  title: {
    textAlign: "center",
    marginBottom: "1rem",
    color: "#22c55e",
  },

  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #1e293b",
    background: "#020617",
    color: "#fff",
  },

  textarea: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #1e293b",
    background: "#020617",
    color: "#fff",
  },

  button: {
    width: "100%",
    padding: "0.75rem",
    background: "#22c55e",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "1rem",
  },

  subTitle: {
    marginTop: "1rem",
    marginBottom: "0.5rem",
  },

  historyItem: {
    background: "#020617",
    border: "1px solid #1e293b",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "0.5rem",
  },
};