import React, { useEffect, useMemo, useState } from "react";
import Modal from "../components/ui/Modal";
import { mockAddWorkout, mockListWorkouts } from "../api/client";

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  const diff = (day + 6) % 7; // convert to Monday-start
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameWeek(a, b) {
  return startOfWeek(a).getTime() === startOfWeek(b).getTime();
}

export default function DashboardHomePage() {
  const [workouts, setWorkouts] = useState(() => mockListWorkouts());
  const [quickOpen, setQuickOpen] = useState(false);
  const [quick, setQuick] = useState({ type: "Strength", minutes: 45, notes: "" });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        setQuickOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const thisWeek = workouts.filter((w) => isSameWeek(new Date(w.date), now));
    const minutes = thisWeek.reduce((acc, w) => acc + (Number(w.minutes) || 0), 0);
    const sessions = thisWeek.length;
    const streak = (() => {
      // Very lightweight streak: consecutive days with workouts.
      const days = new Set(workouts.map((w) => new Date(w.date).toDateString()));
      let s = 0;
      const d = new Date();
      for (let i = 0; i < 60; i++) {
        if (days.has(d.toDateString())) {
          s += 1;
          d.setDate(d.getDate() - 1);
        } else break;
      }
      return s;
    })();

    return { sessions, minutes, streak };
  }, [workouts]);

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="cardHeader">
          <h2 className="cardTitle" style={{ fontSize: 18 }}>Dashboard</h2>
          <span className="badge primary">This week</span>
        </div>

        <div className="grid cols3">
          <div className="card">
            <div className="cardHeader">
              <p className="cardTitle">Sessions</p>
              <span className="badge secondary">{stats.sessions}</span>
            </div>
            <p className="cardSubtle">Workouts logged this week.</p>
          </div>
          <div className="card">
            <div className="cardHeader">
              <p className="cardTitle">Minutes</p>
              <span className="badge warn">{stats.minutes}</span>
            </div>
            <p className="cardSubtle">Total training minutes this week.</p>
          </div>
          <div className="card">
            <div className="cardHeader">
              <p className="cardTitle">Streak</p>
              <span className="badge primary">{stats.streak}d</span>
            </div>
            <p className="cardSubtle">Consecutive days with a workout.</p>
          </div>
        </div>

        <div style={{ marginTop: 12 }} className="btnRow">
          <button className="btn primary" onClick={() => setQuickOpen(true)}>
            Quick log workout <span className="cardSubtle">(press /)</span>
          </button>
          <a className="btn ghost" href="/log">
            View log
          </a>
          <a className="btn ghost" href="/analytics">
            View analytics
          </a>
        </div>
      </div>

      <div className="grid cols2">
        <div className="card">
          <div className="cardHeader">
            <p className="cardTitle">Next workout</p>
            <span className="badge primary">Suggested</span>
          </div>
          <p className="cardSubtle" style={{ marginTop: 0 }}>
            Full-body strength • 45 min • Moderate intensity
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
            <li>Squat 3×5</li>
            <li>Bench 3×5</li>
            <li>Row 3×8</li>
            <li>Core 8 min</li>
          </ul>
        </div>

        <div className="card">
          <div className="cardHeader">
            <p className="cardTitle">Recovery</p>
            <span className="badge secondary">Reminder</span>
          </div>
          <p className="cardSubtle" style={{ marginTop: 0 }}>
            Hydrate and sleep 7–9 hours. Add mobility work on rest days.
          </p>
          <div className="btnRow">
            <button className="btn secondary" onClick={() => setQuickOpen(true)}>
              Log a quick session
            </button>
            <a className="btn ghost" href="/plan">
              Edit plan
            </a>
          </div>
        </div>
      </div>

      <Modal title="Quick Log Workout" open={quickOpen} onClose={() => setQuickOpen(false)} width={680}>
        <div className="formRow">
          <div>
            <label className="label">Type</label>
            <select value={quick.type} onChange={(e) => setQuick((q) => ({ ...q, type: e.target.value }))}>
              <option>Strength</option>
              <option>Cardio</option>
              <option>Mobility</option>
              <option>Sport</option>
            </select>
          </div>
          <div>
            <label className="label">Minutes</label>
            <input
              className="input"
              type="number"
              min={5}
              value={quick.minutes}
              onChange={(e) => setQuick((q) => ({ ...q, minutes: Number(e.target.value || 0) }))}
            />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <label className="label">Notes</label>
          <textarea
            rows={4}
            value={quick.notes}
            onChange={(e) => setQuick((q) => ({ ...q, notes: e.target.value }))}
          />
        </div>
        <div style={{ marginTop: 12 }} className="btnRow">
          <button
            className="btn primary"
            onClick={() => {
              const entry = {
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                type: quick.type,
                minutes: quick.minutes,
                notes: quick.notes
              };
              mockAddWorkout(entry);
              setWorkouts(mockListWorkouts());
              setQuickOpen(false);
            }}
          >
            Save
          </button>
          <button className="btn ghost" onClick={() => setQuickOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
