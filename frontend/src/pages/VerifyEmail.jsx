import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || "Verification failed");
      }
    };
    verify();
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Email Verification</h2>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
        {!message && !error && <p style={{ textAlign: "center" }}>Verifying...</p>}
        <p style={styles.link}><Link to="/login">Go to Login</Link></p>
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
    background: "#020617",
  },

  card: {
    background: "#0f172a",
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
    color: "#22c55e",
  },

  success: {
    color: "#22c55e",
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "bold",
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