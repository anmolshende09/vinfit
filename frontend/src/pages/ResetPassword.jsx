import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      return setError("Passwords don't match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.sub}>Enter your new password below</p>

        {success && <p style={styles.success}>{success}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617" },
  card: { background: "#0f172a", padding: "2rem", borderRadius: "16px", width: "100%", maxWidth: "400px", border: "1px solid #1e293b", boxShadow: "0 4px 25px rgba(0,0,0,0.6)" },
  title: { fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "#22c55e" },
  sub: { color: "#94a3b8", marginBottom: "1.5rem", fontSize: "0.9rem" },
  input: { width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #1e293b", background: "#020617", color: "#fff", fontSize: "1rem", boxSizing: "border-box" },
  button: { width: "100%", padding: "0.75rem", background: "#22c55e", color: "#000", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer" },
  success: { color: "#22c55e", marginBottom: "1rem", textAlign: "center" },
  error: { color: "#ef4444", marginBottom: "1rem", textAlign: "center" },
};