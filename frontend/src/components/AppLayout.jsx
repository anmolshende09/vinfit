import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.container}>
      
      {/* Top Bar */}
      <div style={styles.header}>
        ⚡ VinFit
      </div>

      {/* Page Content */}
      <div style={styles.content}>
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div style={styles.nav}>
        <button
          style={{
            ...styles.navBtn,
            ...(isActive("/dashboard") && styles.active),
          }}
          onClick={() => navigate("/dashboard")}
        >
          🏠
        </button>

        <button
          style={{
            ...styles.navBtn,
            ...(isActive("/meals") && styles.active),
          }}
          onClick={() => navigate("/meals")}
        >
          🍽️
        </button>

        <button
          style={{
            ...styles.navBtn,
            ...(isActive("/progress") && styles.active),
          }}
          onClick={() => navigate("/progress")}
        >
          📊
        </button>

        <button
          style={{
            ...styles.navBtn,
            ...(isActive("/checkins") && styles.active),
          }}
          onClick={() => navigate("/checkins")}
        >
          ⚖️
        </button>
      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: "1rem",
    borderBottom: "1px solid #1e293b",
    textAlign: "center",
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: "1.2rem",
    letterSpacing: "1px",
  },

  content: {
    flex: 1,
    padding: "1rem",
  },

  nav: {
    display: "flex",
    justifyContent: "space-around",
    padding: "0.75rem",
    borderTop: "1px solid #1e293b",
    background: "#0f172a",
  },

  navBtn: {
    background: "transparent",
    border: "none",
    color: "#9ca3af",
    fontSize: "1.3rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  active: {
    color: "#22c55e",
    transform: "scale(1.2)",
  },
};