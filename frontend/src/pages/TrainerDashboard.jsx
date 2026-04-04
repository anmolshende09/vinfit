import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TrainerDashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [mealInput, setMealInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [todayMeals, setTodayMeals] = useState({});
  const [currentPlan, setCurrentPlan] = useState("");

  // Fetch all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/trainer/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data.clients);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [token]);

  // Load meal plan + today's meals when selecting client
  useEffect(() => {
    if (!selected) return;

    // Set goal input
    setGoalInput(selected.goal || "");

    // Fetch meal plan
    const fetchPlan = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/meal-plan/me?userId=${selected._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentPlan(res.data.meals.join(", "));
         setMealInput("");
      } catch (err) {
        setMealInput("breakfast, lunch, dinner, snacks");
      }
    };

    // Fetch today's meal log for this client
    const fetchTodayMeals = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/trainer/client/${selected._id}/today`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTodayMeals(res.data.meals || {});
      } catch (err) {
        setTodayMeals({});
      }
    };

    fetchPlan();
    fetchTodayMeals();
  }, [selected, token]);

  const handleLogout = () => { logout(); navigate("/login"); };

  // Save meal plan
  const saveMealPlan = async () => {
    try {
      setSaving(true);
      await axios.post(
        "http://localhost:5000/api/meal-plan",
        {
          userId: selected._id,
          meals: (mealInput || currentPlan).split(",").map((m) => m.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Meal plan updated ✅");
    } catch (err) {
      alert("Failed to update meal plan");
    } finally {
      setSaving(false);
    }
  };

  // Save goal
  const saveGoal = async () => {
    try {
      setSavingGoal(true);
      await axios.put(
        `http://localhost:5000/api/trainer/client/${selected._id}/goal`,
        { goal: goalInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setClients((prev) =>
        prev.map((c) =>
          c._id === selected._id ? { ...c, goal: goalInput } : c
        )
      );
      setSelected((prev) => ({ ...prev, goal: goalInput }));
      alert("Goal updated ✅");
    } catch (err) {
      alert("Failed to update goal");
    } finally {
      setSavingGoal(false);
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Trainer Dashboard</h2>
          <p style={styles.sub}>Welcome, {user?.name}</p>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {/* Stats */}
      <div style={styles.statsBar}>
        <div style={styles.statBox}>
          <p style={styles.statNum}>{clients.length}</p>
          <p style={styles.statLabel}>Total Clients</p>
        </div>
        <div style={styles.statBox}>
          <p style={styles.statNum}>
            {clients.length > 0
              ? Math.round(clients.reduce((a, c) => a + c.consistency, 0) / clients.length)
              : 0}%
          </p>
          <p style={styles.statLabel}>Avg Consistency</p>
        </div>
        <div style={styles.statBox}>
          <p style={styles.statNum}>{clients.filter((c) => c.missedDays >= 2).length}</p>
          <p style={styles.statLabel}>Need Attention</p>
        </div>
      </div>

      {/* Clients */}
      <div style={styles.clientList}>
        {clients.map((client) => (
          <div
            key={client._id}
            style={{
              ...styles.clientCard,
              border: selected?._id === client._id
                ? "2px solid #22c55e"
                : "1px solid #1e293b",
            }}
            onClick={() => setSelected(selected?._id === client._id ? null : client)}
          >
            {/* Client header */}
            <div style={styles.clientHeader}>
              <div style={styles.avatar}>{client.name.charAt(0).toUpperCase()}</div>
              <div style={styles.clientInfo}>
                <p style={styles.clientName}>{client.name}</p>
                <p style={styles.clientEmail}>{client.email}</p>
              </div>
              <div style={styles.badge}>{client.consistency}%</div>
            </div>

            {/* Expanded detail */}
            {selected?._id === client._id && (
              <div style={styles.detail} onClick={(e) => e.stopPropagation()}>

                {/* Stats grid */}
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <p style={styles.detailLabel}>Days logged</p>
                    <p style={styles.detailValue}>{client.totalDaysLogged}</p>
                  </div>
                  <div style={styles.detailItem}>
                    <p style={styles.detailLabel}>Missed (7d)</p>
                    <p style={{
                      ...styles.detailValue,
                      color: client.missedDays >= 3 ? "#ef4444" : "#22c55e"
                    }}>
                      {client.missedDays} days
                    </p>
                  </div>
                </div>

                {/* ─── Today's meals breakdown ─── */}
                <div style={styles.section}>
                  <p style={styles.sectionTitle}>Today's Meals</p>
                  {Object.keys(todayMeals).length === 0 ? (
                    <p style={styles.noData}>No meals logged today</p>
                  ) : (
                    <div style={styles.mealsGrid}>
                      {Object.entries(todayMeals).map(([meal, done]) => (
                        <div key={meal} style={{
                          ...styles.mealChip,
                          background: done ? "#052e16" : "#1c1917",
                          border: done ? "1px solid #22c55e" : "1px solid #44403c",
                        }}>
                          <span style={{ marginRight: "6px" }}>
                            {done ? "✅" : "❌"}
                          </span>
                          <span style={{
                            color: done ? "#22c55e" : "#78716c",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}>
                            {meal.charAt(0).toUpperCase() + meal.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ─── Goal editor ─── */}
                <div style={styles.section}>
                  <p style={styles.sectionTitle}>Client Goal</p>
                  <select
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    style={styles.input}
                  >
                    <option value="">Not set</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="endurance">Endurance</option>
                  </select>
                  <button
                    style={styles.saveBtn}
                    onClick={saveGoal}
                    disabled={savingGoal}
                  >
                    {savingGoal ? "Saving..." : "Save Goal"}
                  </button>
                </div>

                {/* ─── Meal plan editor ─── */}
                <div style={styles.section}>
                  <p style={styles.sectionTitle}>Edit Meal Plan</p>
                   
                   <input
                         value={mealInput}
                         onChange={(e) => setMealInput(e.target.value)}
                         placeholder={` ${currentPlan || " breakfast, lunch, dinner, snacks"}`}
                         style={{ ...styles.input, color: mealInput ? "#fff" : "#94a3b8" }}
                         onFocus={() => setMealInput("")}
                       />

                  <button
                    style={styles.saveBtn}
                    onClick={saveMealPlan}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Plan"}
                  </button>
                </div>

                {/* Alert */}
                {client.missedDays >= 3 && (
                  <div style={styles.alert}>
                    ⚠️ {client.name} has missed {client.missedDays} days this week!
                  </div>
                )}

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#020617", padding: "1.5rem" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" },
  title: { fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#22c55e" },
  sub: { color: "#94a3b8", margin: "0.25rem 0 0", fontSize: "0.9rem" },
  logoutBtn: { background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "bold" },
  statsBar: { display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" },
  statBox: { background: "#0f172a", borderRadius: "12px", padding: "1rem 1.5rem", flex: 1, minWidth: "120px", textAlign: "center", border: "1px solid #1e293b" },
  statNum: { fontSize: "1.8rem", fontWeight: 700, color: "#22c55e", margin: 0 },
  statLabel: { color: "#94a3b8", fontSize: "0.85rem", margin: "0.25rem 0 0" },
  clientList: { display: "flex", flexDirection: "column", gap: "1rem" },
  clientCard: { background: "#0f172a", borderRadius: "12px", padding: "1.25rem", cursor: "pointer", transition: "all 0.2s ease" },
  clientHeader: { display: "flex", alignItems: "center", gap: "1rem" },
  avatar: { width: "44px", height: "44px", borderRadius: "50%", background: "#22c55e", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.2rem", flexShrink: 0 },
  clientInfo: { flex: 1 },
  clientName: { fontWeight: 600, margin: 0, fontSize: "1rem", color: "#e2e8f0" },
  clientEmail: { color: "#94a3b8", fontSize: "0.85rem", margin: "0.1rem 0 0" },
  badge: { padding: "4px 12px", borderRadius: "20px", fontWeight: 600, fontSize: "0.9rem", background: "#22c55e", color: "#000" },
  detail: { marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #1e293b" },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" },
  detailItem: { background: "#020617", borderRadius: "8px", padding: "0.75rem", border: "1px solid #1e293b" },
  detailLabel: { color: "#94a3b8", fontSize: "0.8rem", margin: 0 },
  detailValue: { fontWeight: 600, margin: "0.25rem 0 0", fontSize: "0.95rem", color: "#e2e8f0" },
  section: { background: "#020617", borderRadius: "10px", padding: "1rem", marginBottom: "0.75rem", border: "1px solid #1e293b" },
  sectionTitle: { color: "#22c55e", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.75rem", margin: "0 0 0.75rem" },
  noData: { color: "#94a3b8", fontSize: "0.85rem", margin: 0 },
  mealsGrid: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  mealChip: { display: "flex", alignItems: "center", padding: "0.4rem 0.75rem", borderRadius: "20px" },
  input: { width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #1e293b", background: "#0f172a", color: "#fff", marginBottom: "0.75rem", boxSizing: "border-box", fontSize: "0.9rem" },
  saveBtn: { width: "100%", padding: "0.7rem", background: "#22c55e", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", color: "#000" },
  alert: { background: "#7f1d1d", border: "1px solid #ef4444", borderRadius: "8px", padding: "0.75rem", marginTop: "0.75rem", color: "#fecaca", fontSize: "0.9rem" },
};