import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../state/auth";

// PUBLIC_INTERFACE
export default function ProtectedRoute({ requiredRole, children }) {
  /** Protects routes based on auth + role (demo/local). */
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
}
