/* eslint-disable no-console */
import { getApiBaseUrl } from "../config/env";

/**
 * If no backend is configured, the app runs in "mock mode" using localStorage.
 */
function isMockMode() {
  return !getApiBaseUrl();
}

function readJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export async function apiFetch(path, options = {}) {
  /** Fetch helper that uses the configured API base URL and provides helpful errors. */
  if (isMockMode()) {
    throw new Error("Backend not configured (REACT_APP_API_BASE/REACT_APP_BACKEND_URL). Running in mock mode.");
  }
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  const json = readJsonSafe(text);

  if (!res.ok) {
    const msg = (json && (json.detail || json.message)) || text || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

/**
 * Mock storage helpers (used by workout log + onboarding in absence of backend).
 */
const LS_KEYS = {
  onboarding: "fitness.onboarding",
  workouts: "fitness.workouts"
};

// PUBLIC_INTERFACE
export function mockGetOnboarding() {
  /** Returns onboarding data from localStorage (mock mode). */
  const raw = localStorage.getItem(LS_KEYS.onboarding);
  return raw ? JSON.parse(raw) : null;
}

// PUBLIC_INTERFACE
export function mockSetOnboarding(data) {
  /** Persists onboarding data to localStorage (mock mode). */
  localStorage.setItem(LS_KEYS.onboarding, JSON.stringify(data));
}

// PUBLIC_INTERFACE
export function mockListWorkouts() {
  /** Returns workout entries from localStorage (mock mode). */
  const raw = localStorage.getItem(LS_KEYS.workouts);
  return raw ? JSON.parse(raw) : [];
}

// PUBLIC_INTERFACE
export function mockAddWorkout(entry) {
  /** Adds a workout entry to localStorage (mock mode). */
  const list = mockListWorkouts();
  const next = [{ ...entry }, ...list];
  localStorage.setItem(LS_KEYS.workouts, JSON.stringify(next));
  return next;
}

// PUBLIC_INTERFACE
export function mockDeleteWorkout(id) {
  /** Deletes a workout entry from localStorage (mock mode). */
  const list = mockListWorkouts().filter((w) => w.id !== id);
  localStorage.setItem(LS_KEYS.workouts, JSON.stringify(list));
  return list;
}
