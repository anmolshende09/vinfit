import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MealTracker() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [mealPlan, setMealPlan] = useState([]); // 🔥 dynamic meals
  const [log, setLog] = useState({
    meals: {},
    notes: "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch meal plan + today's log
  useEffect(() => {
    const fetchData = async () => {
      try {
        const planRes = await axios.get(
          "http://localhost:5000/api/meal-plan/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mealsArray = planRes.data.meals || [];
        setMealPlan(mealsArray);

        const mealRes = await axios.get(
          "http://localhost:5000/api/meals/today",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLog({
          meals: mealRes.data.meal?.meals || {},
          notes: mealRes.data.meal?.notes || "",
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // 🔁 Toggle
  const handleToggle = (meal) => {
    setLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [meal]: !prev.meals?.[meal],
      },
    }));
    setSaved(false);
  };

  // 💾 Save
  const handleSave = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/meals/log",
        log,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSaved(true);
    } catch (err) {
      alert("Failed to save");
    }
  };

  const completedCount = mealPlan.filter(
    (m) => log.meals?.[m]
  ).length;

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <button style={styles.back} onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h2 style={styles.title}>Today's Meals</h2>
          <p style={styles.date}>{new Date().toDateString()}</p>
        </div>

        {/* Progress */}
        <div style={styles.progressWrap}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${mealPlan.length > 0
                           ? (completedCount / mealPlan.length) * 100
                           : 0
                       }%`,
              }}
            />
          </div>

          <p style={styles.progressText}>
  {mealPlan.length === 0
    ? "No meal plan"
    : completedCount === mealPlan.length
    ? "Perfect Day 🎯"
    : `${completedCount}/${mealPlan.length} completed`}
</p>
        </div>

         {/* Meals (dynamic) */}
         <div style={styles.meals}>
           {mealPlan.length === 0 ? (
             <p style={{ textAlign: "center", color: "#94a3b8" }}>
               No meal plan assigned yet
             </p>
           ) : (
             mealPlan.map((meal) => {
               const active = log.meals?.[meal];
         
               return (
                 <div
                   key={meal}
                   onClick={() => handleToggle(meal)}
                   style={{
                     ...styles.mealCard,
                     background: active ? "#22c55e" : "#020617",
                     color: active ? "#000" : "#fff",
                   }}
                 >
                   <span style={styles.mealEmoji}>🍽️</span>
         
                   <span style={styles.mealName}>
                     {meal.charAt(0).toUpperCase() + meal.slice(1)}
                   </span>
         
                   <div
                     style={{
                       ...styles.checkbox,
                       background: active ? "#000" : "#1e293b",
                       border: active ? "2px solid #000" : "1px solid #334155",
                       color: "#fff",
                     }}
                   >
                     {active ? "✓" : ""}
                   </div>
                 </div>
               );
             })
           )}
         </div>

        {/* Notes */}
        <textarea
          style={styles.notes}
          placeholder="How was your diet today..."
          value={log.notes}
          onChange={(e) => {
            setLog({ ...log, notes: e.target.value });
            setSaved(false);
          }}
        />

        {/* Save */}
        <button style={styles.saveBtn} onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save Meals"}
        </button>

      </div>
    </div>
  );
}

const styles = {
  checkbox: {
    width: "26px",
    height: "26px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  container: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#0f172a",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid #22c55e",
  },

  header: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },

  back: {
    background: "none",
    border: "none",
    color: "#22c55e",
    cursor: "pointer",
  },

  title: {
    color: "#22c55e",
  },

  date: {
    color: "#94a3b8",
    fontSize: "0.85rem",
  },

  progressWrap: {
    marginBottom: "1.5rem",
  },

  progressBar: {
    height: "8px",
    background: "#1e293b",
    borderRadius: "6px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#22c55e",
  },

  progressText: {
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#94a3b8",
  },

  meals: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },

  mealCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem",
    borderRadius: "12px",
    cursor: "pointer",
  },

  mealName: {
    flex: 1,
    marginLeft: "0.5rem",
    fontWeight: 600,
  },

  mealEmoji: {
    fontSize: "1.2rem",
  },

  notes: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "1px solid #1e293b",
    background: "#020617",
    color: "#fff",
    marginBottom: "1rem",
  },

  saveBtn: {
    width: "100%",
    padding: "0.8rem",
    background: "#22c55e",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#fff",
  },
};