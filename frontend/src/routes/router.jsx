import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home";

import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import AuthLayout from "../components/layout/AuthLayout";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import DriversPage from "../pages/Drivers/DriversPage";
import CompaniesPage from "../pages/Companies/CompaniesPage";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import DriverDashboard from "../pages/Drivers/DriverDashboard";
import DriverPayments from "../pages/Drivers/DriverPayments";
import CompanyDashboard from "../pages/Companies/CompanyDashboard";
import CompanyAds from "../pages/Companies/CompanyAds";
import CompanyDrivers from "../pages/Companies/CompanyDrivers";
import CompanyPayments from "../pages/Companies/CompanyPayments";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import NotFoundPage from "../pages/NotFoundPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ErrorLayout from "../components/layout/ErrorLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <MainLayout>
                <AuthLayout />
            </MainLayout>
        ),

        children: [
            { index: true, element: <HomePage /> },
            // Auth routes
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "forgot-password", element: <ForgotPasswordPage /> },
            { path: "reset-password", element: <ResetPasswordPage /> },

            // Error pages page
            // { path: "unauthorized", element: <UnauthorizedPage /> },
            {
                element: <ErrorLayout />,
                children: [
                    { path: "unauthorized", element: <UnauthorizedPage /> },
                    { path: "*", element: <NotFoundPage /> },
                ],
            },

            // Public pages
            { path: "drivers", element: <DriversPage /> },
            { path: "companies", element: <CompaniesPage /> },

            // Admin routes (Protected)
            {
                path: "admin",
                element: <ProtectedRoute allowedRoles={["Admin"]} />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: "companies", element: <CompaniesPage /> },
                    { path: "drivers", element: <DriversPage /> },
                ],
            },

            // Drivers routes (Protected)
            {
                path: "driver",
                element: <ProtectedRoute allowedRoles={["Driver"]} />,
                children: [
                    { index: true, element: <DriverDashboard /> },
                    { path: "payments", element: <DriverPayments /> },
                ],
            },

            // Companies routes (Protected)
            {
                path: "company",
                element: <ProtectedRoute allowedRoles={["Company"]} />,
                children: [
                    { index: true, element: <CompanyDashboard /> },
                    { path: "ads", element: <CompanyAds /> },
                    { path: "drivers", element: <CompanyDrivers /> },
                    { path: "payments", element: <CompanyPayments /> },
                ],
            },
            // { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
