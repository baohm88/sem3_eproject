// src/constants/routes.ts
import React from "react";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import CompaniesPage from "../pages/Companies/CompaniesPage";
import DriversPage from "../pages/Drivers/DriversPage";

import CompanyDashboard from "../pages/Companies/CompanyDashboard";
import CompanyServices from "../pages/Companies/CompanyServices";
import CompanyDrivers from "../pages/Companies/CompanyDrivers";
import CompanyPayments from "../pages/Companies/CompanyPayments";
import CompanyProfilePage from "../pages/Companies/CompanyProfilePage";

import DriverDashboard from "../pages/Drivers/DriverDashboard";
import DriverPayments from "../pages/Drivers/DriverPayments";

import NotFoundPage from "../pages/NotFoundPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

export type Role = "Admin" | "Company" | "Driver" | "Rider";

export type RouteItem = {
    path: string; // absolute (under its base)
    label?: string; // appear in nav
    element: React.ReactNode; // page component
    end?: boolean;
    showInNav?: boolean; // default true if label is provided
};

export type RoleRoutes = Record<
    Role,
    {
        base: string; // base path per role
        nav: RouteItem[]; // items to show in nav
        children: RouteItem[]; // full children under base
    }
>;

// Single source of truth
export const ROLE_ROUTES: RoleRoutes = {
    Admin: {
        base: "/admin",
        nav: [
            {
                path: "",
                label: "Dashboard",
                element: <AdminDashboard />,
                end: true,
            },
            {
                path: "companies",
                label: "Companies",
                element: <CompaniesPage />,
            },
            { path: "drivers", label: "Drivers", element: <DriversPage /> },
        ],
        children: [],
    },
    Company: {
        base: "/company",
        nav: [
            {
                path: "",
                label: "Dashboard",
                element: <CompanyDashboard />,
                end: true,
            },
            {
                path: "profile",
                label: "Profile",
                element: <CompanyProfilePage />,
            },
            {
                path: "services",
                label: "Services",
                element: <CompanyServices />,
            },
            { path: "drivers", label: "Drivers", element: <CompanyDrivers /> },
            {
                path: "payments",
                label: "Payments",
                element: <CompanyPayments />,
            },
        ],
        children: [],
    },
    Driver: {
        base: "/driver",
        nav: [
            {
                path: "",
                label: "Dashboard",
                element: <DriverDashboard />,
                end: true,
            },
            {
                path: "payments",
                label: "Your Payments",
                element: <DriverPayments />,
            },
        ],
        children: [],
    },
    Rider: {
        base: "/", // public home
        nav: [
            { path: "", label: "Home", element: <HomePage />, end: true },
            {
                path: "companies",
                label: "Listings",
                element: <CompaniesPage />,
            },
            { path: "drivers", label: "Drivers", element: <DriversPage /> },
            // { path: "services",  label: "Services", element: <ServicesPage /> }, // khi có
            // { path: "advertise", label: "Advertise", element: <AdvertisePage /> },
        ],
        children: [],
    },
};

// helper: build navLinks consumed by NavBar
export function buildNavLinks(role: Role) {
    const def = ROLE_ROUTES[role] ?? ROLE_ROUTES.Rider;
    return def.nav
        .filter((r) => r.label)
        .map((r) => ({
            to:
                (def.base.replace(/\/$/, "") + "/" + r.path).replace(
                    /\/+$/,
                    ""
                ) || "/",
            label: r.label!,
            end: r.end,
        }));
}
