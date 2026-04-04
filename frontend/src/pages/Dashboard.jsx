import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

const [meal, setMeal] = useState(null);
const [checkins, setCheckins] = useState([]);
const [mealPlan, setMealPlan] = useState(null); // ✅ added

  // 🔒 Redirect trainer
  useEffect(() => {
    if (!user) return;

    if (user.role === "trainer") {
      navigate("/trainer");
    }
  }, [user, navigate]);

  // 📊 Fetch data
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const mealRes = await axios.get(
          "http://localhost:5000/api/meals/today",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const checkinRes = await axios.get(
          "http://localhost:5000/api/checkins/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const planRes = await axios.get(
               "http://localhost:5000/api/meal-plan/me",
               {
                 headers: { Authorization: `Bearer ${token}` },
               }
             );

        setMeal(mealRes.data?.meal || {});
        setCheckins(checkinRes.data.checkins || []);
        setMealPlan(planRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // 🚪 Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 📈 Meal progress
const completed = meal
  ? Object.values(meal.meals || {}).filter(Boolean).length
  : 0;

const total = meal
  ? Object.keys(meal.meals || {}).length
  : 0;

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2>Hey {user?.name} 👋</h2>
        <p style={styles.sub}>Stay consistent today</p>
      </div>

      {/* Meal Progress */}
      <div style={styles.block}>
        <p style={styles.blockTitle}>Today's Meals</p>

        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${total ? (completed / total) * 100 : 0}%`,
            }}
          />
        </div>
        <p style={styles.progressText}>{total === 0 ? "No meal plan" : `${completed}/${total} completed`}</p>
      </div>

      {/* Latest Check-in */}
      <div style={styles.block}>
        <p style={styles.blockTitle}>Latest Check-in</p>

        {checkins.length > 0 ? (
          <>
            <p style={styles.weight}>{checkins[0].weight} kg</p>
            <p style={styles.note}>{checkins[0].notes}</p>
          </>
        ) : (
          <p style={styles.note}>No check-ins yet</p>
        )}
      </div>

      {/* Quick Actions */}
      <div style={styles.actions}>
        <button
          style={styles.actionBtn}
          onClick={() => navigate("/meals")}
        >
          Log Meals
        </button>

        <button
          style={styles.actionBtn}
          onClick={() => navigate("/checkins")}
        >
          Add Check-in
        </button>

        <button
          style={styles.actionBtn}
          onClick={() => navigate("/progress")}
        >
          View Progress
        </button>
      </div>

      {/* Logout */}
      <button style={styles.logout} onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  header: {
    marginBottom: "0.5rem",
  },

  sub: {
    color: "#94a3b8",
    fontSize: "0.9rem",
  },

  block: {
    background: "#0f172a",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid #1e293b",
  },

  blockTitle: {
    fontSize: "0.9rem",
    color: "#94a3b8",
    marginBottom: "0.5rem",
  },

  progressBar: {
    height: "8px",
    background: "#1e293b",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "0.5rem",
  },

  progressFill: {
    height: "100%",
    background: "#22c55e",
  },

  progressText: {
    fontSize: "0.8rem",
    color: "#94a3b8",
  },

  weight: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#22c55e",
  },

  note: {
    fontSize: "0.85rem",
    color: "#94a3b8",
  },

  actions: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  actionBtn: {
    flex: 1,
    padding: "0.75rem",
    background: "#22c55e",
    border: "none",
    borderRadius: "10px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },

  logout: {
    padding: "0.75rem",
    background: "#ef4444",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};