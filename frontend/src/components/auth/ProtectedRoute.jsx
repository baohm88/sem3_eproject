// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
    const { profile, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Not logged in -> redirect to LoginPage
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(profile?.role)) {
        // Not allowed → UnauthorizedPage
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
