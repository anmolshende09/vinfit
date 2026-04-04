import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API from "../config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(`${API}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Enter your email" type="email"
            value={email} onChange={e => setEmail(e.target.value)} required />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p style={styles.link}><Link to="/login">Back to Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#020617", // dark bg
  },

  card: {
    background: "#0f172a", // dark card
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.6)",
    border: "1px solid #22c55e",
  },

  title: {
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: 600,
    textAlign: "center",
    color: "#22c55e", // neon green
  },

  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #1e293b",
    fontSize: "1rem",
    boxSizing: "border-box",
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
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },

  success: {
    color: "#22c55e",
    marginBottom: "1rem",
    textAlign: "center",
  },

  error: {
    color: "#ef4444",
    marginBottom: "1rem",
    textAlign: "center",
  },

  link: {
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#94a3b8",
  },
};