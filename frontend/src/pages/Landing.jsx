import { useNavigate } from "react-router-dom";

const features = [
  { icon: "🍽️", title: "Meal Tracking", desc: "Log breakfast, lunch, dinner and snacks daily. Build consistency one meal at a time." },
  { icon: "📊", title: "Progress Analytics", desc: "Track your discipline score, streak and meal consistency over 30 days." },
  { icon: "⚖️", title: "Weekly Check-ins", desc: "Log your weight every week and watch your transformation over time." },
  { icon: "🧑‍🏫", title: "Trainer Oversight", desc: "Your trainer monitors your compliance and steps in when you need a push." },
  { icon: "💳", title: "Simple Plans", desc: "Monthly or yearly — no hidden fees, no contracts. Cancel anytime." },
  { icon: "🔥", title: "Discipline Score", desc: "A unique score that measures how consistent you truly are. Stay accountable." },
];

const plans = [
  { name: "Monthly", price: "₹499", duration: "/month", features: ["Meal tracking", "Weekly check-ins", "Progress analytics", "Trainer access"] },
  { name: "Yearly", price: "₹3,999", duration: "/year", popular: true, features: ["Everything in Monthly", "Save ₹2,000", "Priority support", "Early features"] },
];

const stats = [
  { num: "500+", label: "Active clients" },
  { num: "95%", label: "Consistency rate" },
  { num: "12kg", label: "Avg weight lost" },
  { num: "4.9★", label: "Client rating" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>⚡ VinFit</div>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#pricing" style={styles.navLink}>Pricing</a>
          <button style={styles.loginBtn} onClick={() => navigate("/login")}>Login</button>
          <button style={styles.signupBtn} onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>🔥 India's #1 Fitness Accountability App</div>
        <h1 style={styles.heroTitle}>
          Transform Your Body.<br />
          <span style={styles.heroHighlight}>Track Every Meal.</span><br />
          Stay Accountable.
        </h1>
        <p style={styles.heroSub}>
          VinFit helps you build real discipline — through daily meal logging,
          weekly check-ins, and a trainer who actually watches your progress.
        </p>
        <div style={styles.heroBtns}>
          <button style={styles.ctaPrimary} onClick={() => navigate("/register")}>
            Start Your Journey →
          </button>
          <button style={styles.ctaSecondary} onClick={() => navigate("/login")}>
            Already a member? Login
          </button>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statItem}>
              <p style={styles.statNum}>{s.num}</p>
              <p style={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionBadge}>Features</div>
        <h2 style={styles.sectionTitle}>Everything you need to stay on track</h2>
        <p style={styles.sectionSub}>No fluff. Just the tools that actually build discipline.</p>
        <div style={styles.featuresGrid}>
          {features.map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.aboutInner}>
          <div style={styles.aboutText}>
            <div style={styles.sectionBadge}>About</div>
            <h2 style={styles.sectionTitle}>Built by a trainer,<br />for real results</h2>
            <p style={styles.aboutDesc}>
              VinFit was created by Vinit — a certified fitness trainer who got tired
              of clients losing track between sessions. Most fitness apps give you
              workouts. VinFit gives you <strong>accountability</strong>.
            </p>
            <p style={styles.aboutDesc}>
              Every feature is built around one question:
              <em> "Did you actually eat right today?"</em> — because that's what
              separates results from excuses.
            </p>
            <div style={styles.aboutPoints}>
              {["Real trainer monitoring your progress", "Daily meal logs that take 10 seconds", "Discipline score that doesn't lie", "Weekly weight check-ins for real data"].map((p) => (
                <div key={p} style={styles.aboutPoint}>
                  <span style={styles.aboutCheck}>✓</span> {p}
                </div>
              ))}
            </div>
          </div>
          <div style={styles.aboutVisual}>
            <div style={styles.phoneCard}>
              <div style={styles.phoneHeader}>📱 Today's Log</div>
              {["Breakfast", "Lunch", "Dinner", "Snacks"].map((m, i) => (
                <div key={m} style={styles.phoneRow}>
                  <div style={{...styles.phoneDot, background: i < 3 ? "#22c55e" : "#e5e7eb"}}/>
                  <span style={styles.phoneMeal}>{m}</span>
                  <span style={{...styles.phoneStatus, color: i < 3 ? "#22c55e" : "#9ca3af"}}>
                    {i < 3 ? "Done ✓" : "Pending"}
                  </span>
                </div>
              ))}
              <div style={styles.phoneScore}>
                <span>Discipline Score</span>
                <span style={styles.phoneScoreNum}>87%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={styles.section}>
        <div style={styles.sectionBadge}>Pricing</div>
        <h2 style={styles.sectionTitle}>Simple, honest pricing</h2>
        <p style={styles.sectionSub}>No contracts. No hidden fees. Cancel anytime.</p>
        <div style={styles.plansGrid}>
          {plans.map((plan) => (
            <div key={plan.name} style={{
              ...styles.planCard,
              border: plan.popular ? "2px solid #f97316" : "1px solid #e5e7eb",
              transform: plan.popular ? "scale(1.04)" : "scale(1)",
            }}>
              {plan.popular && <div style={styles.popularBadge}>⭐ Most Popular</div>}
              <h3 style={styles.planName}>{plan.name}</h3>
              <div style={styles.planPrice}>
                {plan.price}<span style={styles.planDur}>{plan.duration}</span>
              </div>
              <div style={styles.planFeatures}>
                {plan.features.map((f) => (
                  <div key={f} style={styles.planFeature}>
                    <span style={styles.planCheck}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button
                style={{...styles.planBtn, background: plan.popular ? "#f97316" : "#6366f1"}}
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={styles.ctaBanner}>
        <h2 style={styles.ctaBannerTitle}>Ready to build real discipline?</h2>
        <p style={styles.ctaBannerSub}>Join hundreds of clients already transforming with VinFit.</p>
        <button style={styles.ctaBannerBtn} onClick={() => navigate("/register")}>
          Start For Free →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerLogo}>⚡ VinFit</p>
        <p style={styles.footerSub}>Built with 💪 by Vinit</p>
        <div style={styles.footerLinks}>
          <a href="#features" style={styles.footerLink}>Features</a>
          <a href="#about" style={styles.footerLink}>About</a>
          <a href="#pricing" style={styles.footerLink}>Pricing</a>
          <span style={styles.footerLink} onClick={() => navigate("/login")}>Login</span>
        </div>
        <p style={styles.footerCopy}>© 2026 VinFit. All rights reserved.</p>
      </footer>

    </div>
  );
}

const styles = {
  page: { fontFamily: "'Segoe UI', sans-serif", background: "#0a0a0a", color: "#fff", overflowX: "hidden" },

  // Navbar
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 3rem", borderBottom: "1px solid #1f1f1f", position: "sticky", top: 0, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)", zIndex: 100 },
  navLogo: { fontSize: "1.5rem", fontWeight: 800, background: "linear-gradient(90deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  navLinks: { display: "flex", alignItems: "center", gap: "1.5rem" },
  navLink: { color: "#9ca3af", textDecoration: "none", fontSize: "0.95rem", transition: "color 0.2s" },
  loginBtn: { background: "transparent", border: "1px solid #374151", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem" },
  signupBtn: { background: "linear-gradient(90deg, #f97316, #ec4899)", border: "none", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 },

  // Hero
  hero: { textAlign: "center", padding: "6rem 2rem 4rem", background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 60%)" },
  heroBadge: { display: "inline-block", background: "#1f1f1f", border: "1px solid #374151", borderRadius: "20px", padding: "0.4rem 1rem", fontSize: "0.85rem", color: "#f97316", marginBottom: "1.5rem" },
  heroTitle: { fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1.5rem" },
  heroHighlight: { background: "linear-gradient(90deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: "1.15rem", color: "#9ca3af", maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: 1.7 },
  heroBtns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem" },
  ctaPrimary: { background: "linear-gradient(90deg, #f97316, #ec4899)", border: "none", color: "#fff", padding: "0.9rem 2rem", borderRadius: "10px", cursor: "pointer", fontSize: "1rem", fontWeight: 700 },
  ctaSecondary: { background: "transparent", border: "1px solid #374151", color: "#9ca3af", padding: "0.9rem 2rem", borderRadius: "10px", cursor: "pointer", fontSize: "1rem" },

  // Stats
  statsRow: { display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap", borderTop: "1px solid #1f1f1f", paddingTop: "3rem" },
  statItem: { textAlign: "center" },
  statNum: { fontSize: "2rem", fontWeight: 800, background: "linear-gradient(90deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 },
  statLabel: { color: "#6b7280", fontSize: "0.85rem", margin: "0.25rem 0 0" },

  // Sections
  section: { padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" },
  sectionBadge: { display: "inline-block", background: "#1f1f1f", border: "1px solid #374151", borderRadius: "20px", padding: "0.3rem 1rem", fontSize: "0.8rem", color: "#f97316", marginBottom: "1rem" },
  sectionTitle: { fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 800, marginBottom: "0.75rem" },
  sectionSub: { color: "#6b7280", fontSize: "1rem", marginBottom: "3rem" },

  // Features
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" },
  featureCard: { background: "#111", border: "1px solid #1f1f1f", borderRadius: "16px", padding: "1.75rem", transition: "border-color 0.2s" },
  featureIcon: { fontSize: "2rem", marginBottom: "1rem" },
  featureTitle: { fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" },
  featureDesc: { color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 },

  // About
  aboutSection: { background: "#0d0d0d", padding: "5rem 2rem" },
  aboutInner: { maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "4rem", alignItems: "center", flexWrap: "wrap" },
  aboutText: { flex: 1, minWidth: "280px" },
  aboutDesc: { color: "#9ca3af", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.95rem" },
  aboutPoints: { display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" },
  aboutPoint: { color: "#d1d5db", fontSize: "0.95rem" },
  aboutCheck: { color: "#22c55e", fontWeight: 700, marginRight: "0.5rem" },
  aboutVisual: { flex: 1, minWidth: "260px", display: "flex", justifyContent: "center" },
  phoneCard: { background: "#111", border: "1px solid #1f1f1f", borderRadius: "20px", padding: "1.5rem", width: "260px" },
  phoneHeader: { fontWeight: 700, marginBottom: "1.25rem", fontSize: "1rem" },
  phoneRow: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" },
  phoneDot: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0 },
  phoneMeal: { flex: 1, fontSize: "0.9rem", color: "#d1d5db" },
  phoneStatus: { fontSize: "0.8rem", fontWeight: 600 },
  phoneScore: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #1f1f1f", fontSize: "0.9rem", color: "#6b7280" },
  phoneScoreNum: { fontSize: "1.3rem", fontWeight: 800, color: "#22c55e" },

  // Pricing
  plansGrid: { display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" },
  planCard: { background: "#111", borderRadius: "16px", padding: "2rem", width: "280px", position: "relative" },
  popularBadge: { position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#f97316", color: "#fff", padding: "4px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" },
  planName: { fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" },
  planPrice: { fontSize: "2.5rem", fontWeight: 800, marginBottom: "1.5rem" },
  planDur: { fontSize: "1rem", fontWeight: 400, color: "#6b7280" },
  planFeatures: { display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" },
  planFeature: { color: "#9ca3af", fontSize: "0.9rem" },
  planCheck: { color: "#22c55e", marginRight: "0.5rem" },
  planBtn: { width: "100%", padding: "0.85rem", border: "none", borderRadius: "10px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "1rem" },

  // CTA Banner
  ctaBanner: { background: "linear-gradient(135deg, #1a0a2e, #0f172a)", textAlign: "center", padding: "5rem 2rem", borderTop: "1px solid #1f1f1f" },
  ctaBannerTitle: { fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 800, marginBottom: "1rem" },
  ctaBannerSub: { color: "#9ca3af", marginBottom: "2rem", fontSize: "1rem" },
  ctaBannerBtn: { background: "linear-gradient(90deg, #f97316, #ec4899)", border: "none", color: "#fff", padding: "1rem 2.5rem", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: 700 },

  // Footer
  footer: { background: "#080808", padding: "3rem 2rem", textAlign: "center", borderTop: "1px solid #1f1f1f" },
  footerLogo: { fontSize: "1.3rem", fontWeight: 800, background: "linear-gradient(90deg, #f97316, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.5rem" },
  footerSub: { color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.5rem" },
  footerLinks: { display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1.5rem" },
  footerLink: { color: "#6b7280", textDecoration: "none", fontSize: "0.9rem", cursor: "pointer" },
  footerCopy: { color: "#374151", fontSize: "0.8rem" },
};