import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";
import { getApiBaseUrl } from "../config/env";

const goals = [
  { id: "strength", label: "Build strength" },
  { id: "fatloss", label: "Fat loss" },
  { id: "endurance", label: "Endurance" },
  { id: "mobility", label: "Mobility & recovery" }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const apiBase = getApiBaseUrl();

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: "",
    experience: "beginner",
    goal: "strength",
    weeklyDays: 3
  });

  const stepTitle = useMemo(() => {
    if (step === 1) return "Welcome";
    if (step === 2) return "Your profile";
    return "Ready";
  }, [step]);

  return (
    <div className="container" style={{ paddingTop: 28, maxWidth: 880 }}>
      <div className="card" style={{ padding: 18 }}>
        <div className="cardHeader">
          <h1 className="cardTitle" style={{ fontSize: 18 }}>{stepTitle}</h1>
          <span className="badge primary">Step {step} of 3</span>
        </div>

        {step === 1 ? (
          <>
            <p style={{ marginTop: 0, color: "var(--muted)" }}>
              Set up your plan in under a minute. This app will run with mock data if your backend URL is not configured.
            </p>
            <div className="grid cols2">
              <div className="card">
                <p className="cardTitle">Backend status</p>
                <p className="cardSubtle">
                  API base: <strong>{apiBase || "Not configured (mock mode)"}</strong>
                </p>
                <p className="help">
                  Configure <code>REACT_APP_API_BASE</code> or <code>REACT_APP_BACKEND_URL</code> in the environment to connect.
                </p>
              </div>
              <div className="card">
                <p className="cardTitle">What you get</p>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
                  <li>Dashboard with weekly summary</li>
                  <li>Workout plan + logging</li>
                  <li>Analytics and trends</li>
                  <li>Admin area (protected)</li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 14 }} className="btnRow">
              <button className="btn primary" onClick={() => setStep(2)}>
                Get started
              </button>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="formRow" style={{ marginTop: 10 }}>
              <div>
                <label className="label">Name</label>
                <input
                  className="input"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Alex"
                />
              </div>
              <div>
                <label className="label">Experience</label>
                <select
                  value={profile.experience}
                  onChange={(e) => setProfile((p) => ({ ...p, experience: e.target.value }))}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="formRow" style={{ marginTop: 10 }}>
              <div>
                <label className="label">Goal</label>
                <select value={profile.goal} onChange={(e) => setProfile((p) => ({ ...p, goal: e.target.value }))}>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Training days / week</label>
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={7}
                  value={profile.weeklyDays}
                  onChange={(e) => setProfile((p) => ({ ...p, weeklyDays: Number(e.target.value || 3) }))}
                />
              </div>
            </div>

            <div style={{ marginTop: 14 }} className="btnRow">
              <button className="btn ghost" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn primary" onClick={() => setStep(3)} disabled={!profile.name.trim()}>
                Continue
              </button>
            </div>
            {!profile.name.trim() ? <p className="help">Enter a name to continue.</p> : null}
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="grid cols2" style={{ marginTop: 10 }}>
              <div className="card">
                <p className="cardTitle">Profile summary</p>
                <p className="cardSubtle" style={{ marginBottom: 0 }}>
                  <strong>{profile.name}</strong> • {profile.experience} • {profile.weeklyDays} days/week
                </p>
                <p className="help" style={{ marginBottom: 0 }}>
                  Goal: <strong>{goals.find((g) => g.id === profile.goal)?.label}</strong>
                </p>
              </div>
              <div className="card">
                <p className="cardTitle">Next</p>
                <p className="cardSubtle" style={{ marginTop: 0 }}>
                  You can log workouts from the sidebar and view analytics anytime.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 14 }} className="btnRow">
              <button className="btn ghost" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                className="btn secondary"
                onClick={() => {
                  completeOnboarding(profile);
                  navigate("/", { replace: true });
                }}
              >
                Finish onboarding
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
