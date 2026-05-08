import React, { useMemo, useState } from "react";
import Modal from "../components/ui/Modal";

const DEFAULT_PLAN = [
  { day: "Mon", title: "Full Body A", items: ["Squat 3×5", "Bench 3×5", "Row 3×8", "Walk 10 min"] },
  { day: "Wed", title: "Full Body B", items: ["Deadlift 3×5", "Overhead Press 3×5", "Pull-down 3×10", "Core 8 min"] },
  { day: "Fri", title: "Cardio + Mobility", items: ["Zone 2 cardio 25 min", "Mobility 15 min", "Stretch 10 min"] }
];

export default function WorkoutPlanPage() {
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState({ day: "Mon", title: "", itemsText: "" });

  const days = useMemo(() => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], []);

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="cardHeader">
          <h2 className="cardTitle" style={{ fontSize: 18 }}>Workout Plan</h2>
          <span className="badge primary">Weekly</span>
        </div>
        <p className="cardSubtle" style={{ marginTop: 0 }}>
          A simple weekly plan you can customize. (Backend integration can replace this with server-saved plans.)
        </p>

        <div className="btnRow">
          <button
            className="btn primary"
            onClick={() => {
              setDraft({ day: "Mon", title: "", itemsText: "" });
              setEditOpen(true);
            }}
          >
            Add day
          </button>
        </div>
      </div>

      <div className="grid cols3">
        {plan.map((p) => (
          <div key={`${p.day}-${p.title}`} className="card">
            <div className="cardHeader">
              <p className="cardTitle">
                {p.day} • {p.title}
              </p>
              <span className="badge secondary">{p.items.length} items</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
              {p.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <div style={{ marginTop: 10 }} className="btnRow">
              <button
                className="btn ghost"
                onClick={() => {
                  setDraft({ day: p.day, title: p.title, itemsText: p.items.join("\n") });
                  setEditOpen(true);
                }}
              >
                Edit
              </button>
              <button className="btn danger" onClick={() => setPlan((list) => list.filter((x) => x !== p))}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal title="Edit plan day" open={editOpen} onClose={() => setEditOpen(false)} width={720}>
        <div className="formRow">
          <div>
            <label className="label">Day</label>
            <select value={draft.day} onChange={(e) => setDraft((d) => ({ ...d, day: e.target.value }))}>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="e.g., Full Body A"
            />
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <label className="label">Items (one per line)</label>
          <textarea
            rows={8}
            value={draft.itemsText}
            onChange={(e) => setDraft((d) => ({ ...d, itemsText: e.target.value }))}
            placeholder={"Squat 3×5\nBench 3×5\nRow 3×8"}
          />
        </div>

        <div style={{ marginTop: 12 }} className="btnRow">
          <button
            className="btn primary"
            onClick={() => {
              const items = draft.itemsText
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              const next = { day: draft.day, title: draft.title || "Workout", items };
              setPlan((prev) => {
                // Replace existing day+title if editing same one; otherwise add.
                const without = prev.filter((p) => !(p.day === next.day && p.title === next.title));
                return [...without, next].sort((a, b) => a.day.localeCompare(b.day));
              });
              setEditOpen(false);
            }}
            disabled={!draft.title.trim()}
          >
            Save
          </button>
          <button className="btn ghost" onClick={() => setEditOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
