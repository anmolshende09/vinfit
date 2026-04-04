import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../config";

export default function Progress() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `${API}/api/progress/summary`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (!data) return <div style={styles.center}>No data found.</div>;

  const scoreColor =
    data.disciplineScore >= 80
      ? "#22c55e"
      : data.disciplineScore >= 50
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <button style={styles.back} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h2 style={styles.title}>Your Progress</h2>

        {/* Score */}
        <div style={styles.scoreBox}>
          <p style={styles.scoreLabel}>Discipline Score</p>
          <div style={{ ...styles.scoreBig, color: scoreColor }}>
            {data.disciplineScore}
            <span style={styles.scorePercent}>%</span>
          </div>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${data.disciplineScore}%`,
                background: scoreColor,
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <p style={styles.statNum}>{data.mealConsistency}%</p>
            <p style={styles.statLabel}>Meal consistency</p>
          </div>

          <div style={styles.statBox}>
            <p style={styles.statNum}>{data.streak}</p>
            <p style={styles.statLabel}>Day streak 🔥</p>
          </div>

          <div style={styles.statBox}>
            <p style={styles.statNum}>{data.totalDaysLogged}</p>
            <p style={styles.statLabel}>Days logged</p>
          </div>
        </div>

        {/* Breakdown */}
        <h3 style={styles.sectionTitle}>Meal Breakdown (last 30 days)</h3>

        <div style={styles.breakdown}>
          {Object.entries(data.breakdown).map(([meal, info]) => {
            const percent =
              info.total > 0 ? (info.done / info.total) * 100 : 0;

            return (
              <div key={meal} style={styles.breakdownRow}>
                <span style={styles.breakdownMeal}>
                  {meal === "breakfast"
                    ? "🌅"
                    : meal === "lunch"
                    ? "☀️"
                    : meal === "dinner"
                    ? "🌙"
                    : "🍎"}{" "}
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </span>

                <div style={styles.breakdownBar}>
                  <div
                    style={{
                      ...styles.breakdownFill,
                      width: `${percent}%`,
                    }}
                  />
                </div>

                <span style={styles.breakdownCount}>
                  {info.done}/{info.total}
                </span>
              </div>
            );
          })}
        </div>

        {/* Last 7 Days */}
        <h3 style={styles.sectionTitle}>Last 7 days</h3>

        <div style={styles.graph}>
          {data.meals.slice(0, 7).reverse().map((meal, i) => {
            const mealEntries = meal.meals ? 
  (typeof meal.meals.toObject === 'function' ? meal.meals.toObject() : meal.meals) 
  : {};
            const total = Object.keys(mealEntries).length;
            const completed = Object.values(mealEntries).filter(Boolean).length;

            const height =
              total > 0 ? `${(completed / total) * 100}%` : "0%";

            return (
              <div key={i} style={styles.bar}>
                <div style={styles.barOuter}>
                  <div style={{ ...styles.barFill, height }} />
                </div>
                <p style={styles.barLabel}>{meal.date.slice(5)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    justifyContent: "center",
    padding: "1rem",
  },

  card: {
    background: "#0f172a",
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.6)",
    border: "1px solid #22c55e",
  },

  back: {
    background: "none",
    border: "none",
    color: "#22c55e",
    cursor: "pointer",
    marginBottom: "0.5rem",
  },

  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    color: "#22c55e",
  },

  scoreBox: {
    background: "#020617",
    borderRadius: "12px",
    padding: "1.5rem",
    textAlign: "center",
    marginBottom: "1.5rem",
    border: "1px solid #1e293b",
  },

scoreLabel: {
  color: "#94a3b8",
  margin: "0 0 0.5rem 0",
  fontSize: "0.9rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
},

scoreBig: {
  fontSize: "4rem",
  fontWeight: 800,
  lineHeight: 1,
  margin: "0.25rem 0",
},

  scorePercent: {
    fontSize: "1.5rem",
    color: "#e2e8f0",
  },

  progressBar: {
    height: "8px",
    background: "#1e293b",
    borderRadius: "4px",
    overflow: "hidden",
    marginTop: "1rem",
  },

  progressFill: {
    height: "100%",
    transition: "width 0.5s ease",
  },

  statsRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
  },

  statBox: {
    flex: 1,
    background: "#020617",
    borderRadius: "10px",
    padding: "1rem",
    textAlign: "center",
    border: "1px solid #1e293b",
  },

  statNum: {
    fontSize: "1.5rem",
    color: "#22c55e",
  },

  statLabel: {
    fontSize: "0.75rem",
    color: "#94a3b8",
  },

  sectionTitle: {
    marginBottom: "1rem",
    color: "#22c55e",
  },

  breakdown: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },

  breakdownRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  breakdownMeal: {
    width: "100px",
    color: "#e2e8f0",
  },

  breakdownBar: {
    flex: 1,
    height: "8px",
    background: "#1e293b",
    borderRadius: "4px",
  },

  breakdownFill: {
    height: "100%",
    background: "#22c55e",
  },

  breakdownCount: {
    width: "40px",
    fontSize: "0.8rem",
    color: "#94a3b8",
  },

  graph: {
    display: "flex",
    gap: "0.5rem",
    height: "120px",
    alignItems: "flex-end",
  },

  bar: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  barOuter: {
    flex: 1,
    width: "100%",
    background: "#1e293b",
    borderRadius: "6px",
    display: "flex",
    alignItems: "flex-end",
  },

  barFill: {
    width: "100%",
    background: "#22c55e",
    transition: "height 0.5s ease",
  },

  barLabel: {
    fontSize: "0.65rem",
    color: "#94a3b8",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
};