import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PLANS = [
  { id: "monthly", name: "Monthly", price: "₹499", duration: "30 days", amount: 49900 },
  { id: "yearly", name: "Yearly", price: "₹3,999", duration: "365 days", amount: 399900, popular: true },
];

export default function Plans() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const handlePayment = async (plan) => {
    setLoading(plan.id);
    try {
      // 1. Create order from backend
      const res = await axios.post(
        "http://localhost:5000/api/payments/create-order",
        { plan: plan.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount, currency, keyId } = res.data;

      // 2. Open Razorpay popup
      const options = {
        key: keyId,
        amount,
        currency,
        name: "Fitness App",
        description: `${plan.name} Subscription`,
        order_id: orderId,
        handler: async (response) => {
          // 3. Verify payment on backend
          try {
            await axios.post(
              "http://localhost:5000/api/payments/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                plan: plan.id,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Payment successful! Subscription activated.");
            navigate("/dashboard");
          } catch (err) {
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Choose Your Plan</h2>
      <p style={styles.subtitle}>Start your fitness journey today</p>
      <div style={styles.grid}>
        {PLANS.map((plan) => (
          <div key={plan.id} style={{
            ...styles.card,
            border: plan.popular ? "2px solid #6366f1" : "1px solid #e5e7eb",
          }}>
            {plan.popular && <div style={styles.badge}>Most Popular</div>}
            <h3 style={styles.planName}>{plan.name}</h3>
            <p style={styles.price}>{plan.price}</p>
            <p style={styles.duration}>{plan.duration}</p>
            <button
              style={{...styles.button, opacity: loading === plan.id ? 0.7 : 1}}
              onClick={() => handlePayment(plan)}
              disabled={loading === plan.id}
            >
              {loading === plan.id ? "Processing..." : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#020617",
    padding: "3rem 1rem",
    color: "#fff",
  },

  title: {
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
    color: "#22c55e", // neon green
  },

  subtitle: {
    textAlign: "center",
    color: "#94a3b8",
    marginBottom: "2rem",
  },

  grid: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  card: {
    background: "#0f172a",
    borderRadius: "16px",
    padding: "2rem",
    width: "260px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 4px 25px rgba(0,0,0,0.6)",
    border: "1px solid #1e293b",
    transition: "all 0.25s ease",
  },

  cardHighlight: {
    border: "1px solid #22c55e",
    transform: "scale(1.05)",
  },

  badge: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#22c55e",
    color: "#000",
    padding: "4px 16px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },

  planName: {
    fontSize: "1.3rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#fff",
  },

  price: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#22c55e",
    marginBottom: "0.25rem",
  },

  duration: {
    color: "#94a3b8",
    marginBottom: "1.5rem",
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
    transition: "all 0.2s ease",
  },
};