import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardHomePage from "./pages/DashboardHomePage";
import WorkoutPlanPage from "./pages/WorkoutPlanPage";
import WorkoutLogPage from "./pages/WorkoutLogPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import { AuthProvider, useAuth } from "./state/auth";

/**
 * Decide where to send the user based on onboarding completion.
 */
function OnboardingIndexRedirect() {
  const { onboardingCompleted } = useAuth();
  return onboardingCompleted ? <Navigate to="/" replace /> : <Navigate to="/onboarding" replace />;
}

/**
 * Wrap routes that should render inside the sidebar layout.
 */
function LayoutRoutes() {
  const { onboardingCompleted } = useAuth();
  const location = useLocation();

  // If a user tries to access app pages before completing onboarding, redirect them.
  if (!onboardingCompleted && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardHomePage />} />
        <Route path="/plan" element={<WorkoutPlanPage />} />
        <Route path="/log" element={<WorkoutLogPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/start" element={<OnboardingIndexRedirect />} />
        <Route path="/*" element={<LayoutRoutes />} />
      </Routes>
    </AuthProvider>
  );
}
