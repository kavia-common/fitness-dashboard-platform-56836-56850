import React, { useMemo, useState } from "react";
import Modal from "../components/ui/Modal";
import { mockAddWorkout, mockDeleteWorkout, mockListWorkouts } from "../api/client";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function WorkoutLogPage() {
  const [workouts, setWorkouts] = useState(() => mockListWorkouts());
  const [filter, setFilter] = useState("All");

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    type: "Strength",
    minutes: 45,
    date: new Date().toISOString().slice(0, 16),
    notes: ""
  });

  const filtered = useMemo(() => {
    if (filter === "All") return workouts;
    return workouts.filter((w) => w.type === filter);
  }, [workouts, filter]);

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="cardHeader">
          <h2 className="cardTitle" style={{ fontSize: 18 }}>Workout Log</h2>
          <span className="badge primary">{workouts.length} total</span>
        </div>

        <div className="formRow" style={{ alignItems: "end" }}>
          <div>
            <label className="label">Filter</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Strength</option>
              <option>Cardio</option>
              <option>Mobility</option>
              <option>Sport</option>
            </select>
          </div>
          <div className="btnRow" style={{ justifyContent: "flex-end" }}>
            <button className="btn primary" onClick={() => setOpen(true)}>
              Add workout
            </button>
          </div>
        </div>
      </div>

      <div className="grid cols2">
        {filtered.map((w) => (
          <div key={w.id} className="card">
            <div className="cardHeader">
              <p className="cardTitle">{w.type}</p>
              <span className="badge warn">{w.minutes} min</span>
            </div>
            <p className="cardSubtle" style={{ marginTop: 0 }}>
              {formatDate(w.date)}
            </p>
            {w.notes ? <p style={{ marginTop: 10, marginBottom: 0, color: "var(--muted)" }}>{w.notes}</p> : null}

            <div style={{ marginTop: 12 }} className="btnRow">
              <button
                className="btn danger"
                onClick={() => {
                  mockDeleteWorkout(w.id);
                  setWorkouts(mockListWorkouts());
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal title="Add workout" open={open} onClose={() => setOpen(false)} width={720}>
        <div className="formRow">
          <div>
            <label className="label">Type</label>
            <select value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}>
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
              value={draft.minutes}
              onChange={(e) => setDraft((d) => ({ ...d, minutes: Number(e.target.value || 0) }))}
            />
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label className="label">Date & time</label>
          <input
            className="input"
            type="datetime-local"
            value={draft.date}
            onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label className="label">Notes</label>
          <textarea rows={5} value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
        </div>

        <div style={{ marginTop: 12 }} className="btnRow">
          <button
            className="btn primary"
            onClick={() => {
              const entry = {
                id: crypto.randomUUID(),
                type: draft.type,
                minutes: draft.minutes,
                date: new Date(draft.date).toISOString(),
                notes: draft.notes
              };
              mockAddWorkout(entry);
              setWorkouts(mockListWorkouts());
              setOpen(false);
            }}
          >
            Save
          </button>
          <button className="btn ghost" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
