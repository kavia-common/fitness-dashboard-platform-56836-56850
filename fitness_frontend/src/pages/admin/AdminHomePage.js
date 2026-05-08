import React, { useMemo, useState } from "react";
import { getApiBaseUrl } from "../../config/env";

function fakeUsers() {
  return [
    { id: "u1", email: "user1@example.com", plan: "Beginner", status: "active" },
    { id: "u2", email: "user2@example.com", plan: "Intermediate", status: "active" },
    { id: "u3", email: "user3@example.com", plan: "Advanced", status: "paused" }
  ];
}

export default function AdminHomePage() {
  const api = getApiBaseUrl();
  const [users, setUsers] = useState(() => fakeUsers());

  const totals = useMemo(() => {
    const active = users.filter((u) => u.status === "active").length;
    return { active, total: users.length };
  }, [users]);

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="cardHeader">
          <h2 className="cardTitle" style={{ fontSize: 18 }}>Admin</h2>
          <span className="badge secondary">Protected</span>
        </div>
        <p className="cardSubtle" style={{ marginTop: 0 }}>
          Admin-only area. Connect to your backend at <strong>{api || "not configured"}</strong> to manage real data.
        </p>

        <div className="grid cols3">
          <div className="card">
            <div className="cardHeader">
              <p className="cardTitle">Users</p>
              <span className="badge primary">{totals.total}</span>
            </div>
            <p className="cardSubtle">Total (demo).</p>
          </div>
          <div className="card">
            <div className="cardHeader">
              <p className="cardTitle">Active</p>
              <span className="badge secondary">{totals.active}</span>
            </div>
            <p className="cardSubtle">Active users (demo).</p>
          </div>
          <div className="card">
            <div className="cardHeader">
              <p className="cardTitle">Alerts</p>
              <span className="badge warn">0</span>
            </div>
            <p className="cardSubtle">No alerts.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <p className="cardTitle">User list</p>
          <span className="badge primary">Demo</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Email", "Plan", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 12,
                      color: "var(--muted)",
                      padding: "10px 8px",
                      borderBottom: "1px solid var(--border)"
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>{u.email}</td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>
                    {u.plan}
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>
                    <span className={`badge ${u.status === "active" ? "secondary" : "warn"}`}>{u.status}</span>
                  </td>
                  <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>
                    <div className="btnRow">
                      <button
                        className="btn ghost"
                        onClick={() =>
                          setUsers((list) =>
                            list.map((x) => (x.id === u.id ? { ...x, status: x.status === "active" ? "paused" : "active" } : x))
                          )
                        }
                      >
                        Toggle
                      </button>
                      <button className="btn danger" onClick={() => setUsers((list) => list.filter((x) => x.id !== u.id))}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length ? (
                <tr>
                  <td colSpan={4} style={{ padding: 12, color: "var(--muted)" }}>
                    No users.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <p className="help">
          This section is intentionally minimal and can be wired to real backend admin endpoints once available.
        </p>
      </div>
    </div>
  );
}
