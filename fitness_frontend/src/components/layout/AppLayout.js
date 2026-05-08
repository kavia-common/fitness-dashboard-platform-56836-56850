import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../state/auth";

function NavItem({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        display: "block",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: isActive ? "rgba(59,130,246,0.10)" : "transparent",
        color: "var(--text)",
        fontWeight: isActive ? 750 : 600
      })}
    >
      {label}
    </NavLink>
  );
}

// PUBLIC_INTERFACE
export default function AppLayout({ children }) {
  /** Main layout with persistent sidebar and responsive drawer. */
  const { role, setRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = useMemo(
    () => [
      { to: "/", label: "Dashboard", end: true },
      { to: "/plan", label: "Workout Plan" },
      { to: "/log", label: "Workout Log" },
      { to: "/analytics", label: "Analytics" }
    ],
    []
  );

  const showAdmin = role === "admin";

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "280px 1fr" }}>
      {/* Sidebar (desktop) */}
      <aside
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          padding: 14,
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "none"
        }}
        className="sidebarDesktop"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div
            aria-hidden="true"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.25)",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              color: "#1d4ed8"
            }}
          >
            FD
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>Fitness Dashboard</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Light • Modern</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {nav.map((n) => (
            <NavItem key={n.to} to={n.to} label={n.label} end={n.end} />
          ))}
          {showAdmin ? <NavItem to="/admin" label="Admin" /> : null}
        </div>

        <div style={{ marginTop: 16 }} className="card">
          <div className="cardHeader">
            <p className="cardTitle">Role (demo)</p>
            <span className={`badge ${role === "admin" ? "secondary" : "primary"}`}>{role}</span>
          </div>
          <p className="cardSubtle" style={{ marginTop: 0 }}>
            Toggle to preview protected admin routes.
          </p>
          <div className="btnRow">
            <button className="btn ghost" onClick={() => setRole("user")}>
              User
            </button>
            <button className="btn secondary" onClick={() => setRole("admin")}>
              Admin
            </button>
          </div>
        </div>

        <p style={{ marginTop: 14, fontSize: 12, color: "var(--muted)" }}>
          Tip: Press <span className="kbd">/</span> to open quick add workout.
        </p>
      </aside>

      {/* Main */}
      <main style={{ minWidth: 0 }}>
        {/* Top bar (mobile) */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(249,250,251,0.86)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid var(--border)",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
          className="mobileHeader"
        >
          <button className="btn ghost" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            Menu
          </button>
          <div style={{ fontWeight: 800 }}>Fitness Dashboard</div>
          <span className={`badge ${role === "admin" ? "secondary" : "primary"}`}>{role}</span>
        </header>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="modal" style={{ maxWidth: 420 }}>
              <div className="modalTop">
                <div style={{ fontWeight: 800 }}>Navigate</div>
                <button className="btn ghost" onClick={() => setMobileOpen(false)}>
                  Close
                </button>
              </div>
              <div className="modalBody">
                <div style={{ display: "grid", gap: 8 }}>
                  {nav.map((n) => (
                    <div key={n.to} onClick={() => setMobileOpen(false)}>
                      <NavItem to={n.to} label={n.label} end={n.end} />
                    </div>
                  ))}
                  {showAdmin ? (
                    <div onClick={() => setMobileOpen(false)}>
                      <NavItem to="/admin" label="Admin" />
                    </div>
                  ) : null}
                </div>

                <div style={{ marginTop: 12 }} className="card">
                  <div className="cardHeader">
                    <p className="cardTitle">Role (demo)</p>
                  </div>
                  <div className="btnRow">
                    <button className="btn ghost" onClick={() => setRole("user")}>
                      User
                    </button>
                    <button className="btn secondary" onClick={() => setRole("admin")}>
                      Admin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="container" style={{ paddingTop: 16 }}>
          {children}
        </div>
      </main>

      {/* Layout CSS helpers */}
      <style>
        {`
          @media (min-width: 980px) {
            .sidebarDesktop { display: block !important; }
            .mobileHeader { display: none !important; }
          }
        `}
      </style>
    </div>
  );
}
