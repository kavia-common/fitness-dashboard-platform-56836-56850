import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockGetOnboarding, mockSetOnboarding } from "../api/client";

const AuthContext = createContext(null);

const LS_AUTH = "fitness.auth";

/**
 * This app uses a lightweight local auth model (suitable for demo).
 * Integrate real auth by replacing these methods to call backend/Supabase/etc.
 */
function loadAuth() {
  const raw = localStorage.getItem(LS_AUTH);
  if (!raw) return { isAuthenticated: true, role: "user" };
  try {
    return JSON.parse(raw);
  } catch {
    return { isAuthenticated: true, role: "user" };
  }
}

function saveAuth(state) {
  localStorage.setItem(LS_AUTH, JSON.stringify(state));
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth + onboarding completion state across the app. */
  const [auth, setAuth] = useState(loadAuth());
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const onboarding = mockGetOnboarding();
    setOnboardingCompleted(Boolean(onboarding && onboarding.completed));
  }, []);

  const value = useMemo(() => {
    return {
      ...auth,
      onboardingCompleted,
      // PUBLIC_INTERFACE
      completeOnboarding: (payload) => {
        /** Mark onboarding complete and store profile payload. */
        mockSetOnboarding({ completed: true, ...payload });
        setOnboardingCompleted(true);
      },
      // PUBLIC_INTERFACE
      setRole: (role) => {
        /** Set the current user's role (demo helper). */
        const next = { ...auth, role };
        setAuth(next);
        saveAuth(next);
      },
      // PUBLIC_INTERFACE
      logout: () => {
        /** "Logout" for demo purposes. */
        const next = { isAuthenticated: false, role: "user" };
        setAuth(next);
        saveAuth(next);
      },
      // PUBLIC_INTERFACE
      login: () => {
        /** "Login" for demo purposes. */
        const next = { isAuthenticated: true, role: auth.role || "user" };
        setAuth(next);
        saveAuth(next);
      }
    };
  }, [auth, onboardingCompleted]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
