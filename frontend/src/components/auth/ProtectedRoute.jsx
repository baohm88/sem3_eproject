// src/components/auth/ProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Route guard for protected areas.
 *
 * Usage:
 *   <Route element={<ProtectedRoute allowedRoles={['Company', 'Admin']} />}>
 *     <Route path="/company" element={<CompanyPage />} />
 *   </Route>
 *
 * Behavior:
 * - If the user is not authenticated → redirect to /login.
 * - If `allowedRoles` is provided and the user's role is not included →
 *   redirect to /unauthorized.
 * - Otherwise, render nested routes via <Outlet />.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { profile, isAuthenticated } = useAuth();

  // Not logged in → send to Login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but lacking permissions → send to Unauthorized page
  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render the protected child route(s)
  return <Outlet />;
}
