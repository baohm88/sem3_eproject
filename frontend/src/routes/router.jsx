import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home";

import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/Auth/Login";
import RegisterPage from "../pages/Auth/Register";
import AuthLayout from "../components/layout/AuthLayout";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

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
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "forgot-password", element: <ForgotPasswordPage /> },
            { path: "reset-password", element: <ResetPasswordPage /> },
        ],
    },
]);
