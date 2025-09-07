import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ErrorLayout from "../components/layout/ErrorLayout";

import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";

import CompaniesPage from "../pages/Companies/CompaniesPage";
import DriversPage from "../pages/Drivers/DriversPage";
import HomePage from "../pages/Home";
import ServicesPage from "../pages/ServicesPage";
import AdvertisePage from "../pages/AdvertisePage";
import FeedbackPage from "../pages/FeedbackPage";

import { ROLE_ROUTES, PUBLIC_ROUTES } from "./routes.tsx";

// helper builder
function buildProtectedChildren(role) {
    const def = ROLE_ROUTES[role];
    if (!def) return [];
    return def.nav.concat(def.children).map((r) => ({
        path: r.path,
        element: r.element,
        index: r.end === true,
    }));
}

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <MainLayout>
                <AuthLayout />
            </MainLayout>
        ),
        children: [
            // public basic (Rider base already covers "/")
            ...PUBLIC_ROUTES.map((r) => ({
                index: r.end === true && (r.path === "/" || r.path === ""),
                path: r.path.replace(/^\//, ""),
                element: r.element,
            })),
            // auth
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },

            // protected: Admin
            {
                path: ROLE_ROUTES.Admin.base.slice(1),
                element: <ProtectedRoute allowedRoles={["Admin"]} />,
                children: buildProtectedChildren("Admin"),
            },

            // protected: Company
            {
                path: ROLE_ROUTES.Company.base.slice(1),
                element: <ProtectedRoute allowedRoles={["Company"]} />,
                children: buildProtectedChildren("Company"),
            },

            // protected: Driver
            {
                path: ROLE_ROUTES.Driver.base.slice(1),
                element: <ProtectedRoute allowedRoles={["Driver"]} />,
                children: buildProtectedChildren("Driver"),
            },

            // error layout + catch-all
            {
                element: <ErrorLayout />,
                children: [
                    { path: "unauthorized", element: <UnauthorizedPage /> },
                    { path: "*", element: <NotFoundPage /> },
                ],
            },
        ],
    },
]);

export { router };
export default router;
