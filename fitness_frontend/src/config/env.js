/* eslint-disable no-console */

/**
 * Small environment helper layer.
 * Prefer REACT_APP_API_BASE, fallback to REACT_APP_BACKEND_URL if present.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the API base URL configured via env vars. */
  const apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "";
  return apiBase.replace(/\/+$/, "");
}

// PUBLIC_INTERFACE
export function getFrontendUrl() {
  /** Returns the frontend public URL (if configured). */
  return (process.env.REACT_APP_FRONTEND_URL || "").replace(/\/+$/, "");
}

// PUBLIC_INTERFACE
export function getWsUrl() {
  /** Returns the websocket URL (if configured). */
  return (process.env.REACT_APP_WS_URL || "").replace(/\/+$/, "");
}

// PUBLIC_INTERFACE
export function debugEnvSummary() {
  /** Logs the effective env configuration to help diagnose deployments. */
  if (process.env.REACT_APP_NODE_ENV === "production") return;
  console.log("[env] apiBase:", getApiBaseUrl());
  console.log("[env] frontendUrl:", getFrontendUrl());
  console.log("[env] wsUrl:", getWsUrl());
}
