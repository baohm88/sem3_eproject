// src/routes/router.jsx

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ErrorLayout from "../components/layout/ErrorLayout";

import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";

import { ROLE_ROUTES, PUBLIC_ROUTES } from "./routes.tsx";

// Helper: build protected child routes for a given role.
// Combines `nav` and `children`, and sets `index` when `end === true`.
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
      // Public routes (Rider base already covers "/")
      ...PUBLIC_ROUTES.map((r) => ({
        index: r.end === true && (r.path === "/" || r.path === ""),
        path: r.path.replace(/^\//, ""),
        element: r.element,
      })),

      // Auth pages
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      // Protected: Admin area
      {
        path: ROLE_ROUTES.Admin.base.slice(1),
        element: <ProtectedRoute allowedRoles={["Admin"]} />,
        children: buildProtectedChildren("Admin"),
      },

      // Protected: Company area
      {
        path: ROLE_ROUTES.Company.base.slice(1),
        element: <ProtectedRoute allowedRoles={["Company"]} />,
        children: buildProtectedChildren("Company"),
      },

      // Protected: Driver area
      {
        path: ROLE_ROUTES.Driver.base.slice(1),
        element: <ProtectedRoute allowedRoles={["Driver"]} />,
        children: buildProtectedChildren("Driver"),
      },

      // Error layout + catch-alls (rendered inside ErrorLayout)
      {
        element: <ErrorLayout />,
        children: [
          { path: "unauthorized", element: <UnauthorizedPage /> }, // 401/403
          { path: "*", element: <NotFoundPage /> }, // 404 fallback
        ],
      },
    ],
  },
]);

export { router };
export default router;
