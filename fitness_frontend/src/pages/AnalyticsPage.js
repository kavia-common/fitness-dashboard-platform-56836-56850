import React, { useMemo } from "react";
import { mockListWorkouts } from "../api/client";

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDayKey(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function AnalyticsPage() {
  const workouts = useMemo(() => mockListWorkouts(), []);

  const last14 = useMemo(() => {
    const start = daysAgo(13);
    const buckets = new Map();
    for (let i = 13; i >= 0; i--) {
      const k = toDayKey(daysAgo(i));
      buckets.set(k, { day: k, minutes: 0, sessions: 0 });
    }
    workouts.forEach((w) => {
      const d = new Date(w.date);
      if (d >= start) {
        const k = toDayKey(d);
        const b = buckets.get(k);
        if (b) {
          b.minutes += Number(w.minutes) || 0;
          b.sessions += 1;
        }
      }
    });
    return Array.from(buckets.values());
  }, [workouts]);

  const totals = useMemo(() => {
    const minutes = last14.reduce((acc, x) => acc + x.minutes, 0);
    const sessions = last14.reduce((acc, x) => acc + x.sessions, 0);
    const avg = sessions ? Math.round(minutes / sessions) : 0;
    const best = last14.reduce((m, x) => Math.max(m, x.minutes), 0);
    return { minutes, sessions, avg, best };
  }, [last14]);

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="cardHeader">
          <h2 className="cardTitle" style={{ fontSize: 18 }}>Analytics</h2>
          <span className="badge primary">Last 14 days</span>
        </div>
        <p className="cardSubtle" style={{ marginTop: 0 }}>
          Summary and trends based on your workout log.
        </p>

        <div className="grid cols3">
          <div className="card">
            <div className="cardHeader">
              <p className="cardTitle">Total minutes</p>
              <span className="badge warn">{totals.minutes}</span>
            </div>
            <p className="cardSubtle">Sum of logged minutes.</p>
          </div>
          <div className="card">
            <div className="cardHeader">
              <p className="cardTitle">Sessions</p>
              <span className="badge secondary">{totals.sessions}</span>
            </div>
            <p className="cardSubtle">Total workouts logged.</p>
          </div>
          <div className="card">
            <div className="cardHeader">
              <p className="cardTitle">Avg / session</p>
              <span className="badge primary">{totals.avg} min</span>
            </div>
            <p className="cardSubtle">Average duration.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="cardHeader">
          <p className="cardTitle">Daily minutes</p>
          <span className="badge primary">Sparkline</span>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {last14.map((d) => {
            const pct = totals.best ? Math.round((d.minutes / totals.best) * 100) : 0;
            return (
              <div key={d.day} style={{ display: "grid", gridTemplateColumns: "120px 1fr 70px", gap: 10, alignItems: "center" }}>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{d.day}</div>
                <div
                  aria-label={`${d.minutes} minutes`}
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: "rgba(59,130,246,0.12)",
                    overflow: "hidden",
                    border: "1px solid rgba(59,130,246,0.14)"
                  }}
                >
                  <div style={{ width: `${pct}%`, height: "100%", background: "var(--primary)" }} />
                </div>
                <div style={{ textAlign: "right", fontSize: 12, color: "var(--muted)" }}>{d.minutes}m</div>
              </div>
            );
          })}
        </div>

        <p className="help">
          Add more workouts to see trends. This can be replaced by backend analytics endpoints when available.
        </p>
      </div>
    </div>
  );
}
