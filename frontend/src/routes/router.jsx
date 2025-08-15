import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home";

import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/Auth/Login";
import RegisterPage from "../pages/Auth/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);
