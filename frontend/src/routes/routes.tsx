// src/routes/routes.tsx
import React from "react";
import HomePage from "../pages/Home";
import ServicesPage from "../pages/ServicesPage";
import AdvertisePage from "../pages/AdvertisePage";
import FeedbackPage from "../pages/FeedbackPage";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import CompaniesPage from "../pages/Companies/CompaniesPage";

import CompanyDashboard from "../pages/Companies/CompanyDashboard";
import CompanyServices from "../pages/Companies/CompanyServices";
import CompanyDrivers from "../pages/Companies/CompanyDrivers";
import CompanyTransactions from "../pages/Companies/CompanyTransactions";
import CompanyProfilePage from "../pages/Companies/CompanyProfilePage";
import CompanyInvitesPage from "../pages/Companies/CompanyInvitesPage";

import DriverProfilePage from "../pages/Drivers/DriverProfilePage";
import DriverPublicProfilePage from "../pages/Drivers/DriverPublicProfilePage";
import DriverJobsPage from "../pages/Drivers/DriverJobsPage";
import DriverApplicationsPage from "../pages/Drivers/DriverApplicationsPage";
import DriverInvitesPage from "../pages/Drivers/DriverInvitesPage";
import DriverTransactions from "../pages/Drivers/DriverTransactions";

import DriversPage from "../pages/Drivers/DriversPage";
import DriverDashboard from "../pages/Drivers/DriverDashboard";
import CompanyPublicProfilePage from "../pages/Companies/CompanyPublicProfilePage";
import CompanyApplicationsPage from "../pages/Companies/CompanyApplicationsPage";

/**
 * Route typing and role-based route configuration for the app.
 * Keep this file as the single source of truth for route definitions.
 */
export type Role = "Admin" | "Company" | "Driver" | "Rider";

export type RouteItem = {
  path: string;
  label?: string;
  element: React.ReactNode;
  end?: boolean;
  showInNav?: boolean;
};

export type RoleRoutes = Record<
  Role,
  {
    base: string;
    nav: RouteItem[];
    children: RouteItem[];
  }
>;

/** Public (unauthenticated) routes visible in the main navbar when applicable. */
export const PUBLIC_ROUTES: RouteItem[] = [
  { path: "/", label: "Home", element: <HomePage />, end: true },
  { path: "/listings", label: "Listings", element: <CompaniesPage /> },
  { path: "/listings/:companyId", element: <CompanyPublicProfilePage /> },
  { path: "/drivers", label: "Drivers", element: <DriversPage /> },
  { path: "/drivers/:driverId", element: <DriverPublicProfilePage /> },
  { path: "/services", label: "Services", element: <ServicesPage /> },
  { path: "/feedback", label: "Feedback", element: <FeedbackPage /> },
  { path: "/advertise", label: "Advertise", element: <AdvertisePage /> },
];

/** Single source of truth: role-scoped base paths, nav tabs (SubNav), and child pages. */
export const ROLE_ROUTES: RoleRoutes = {
  Admin: {
    base: "/admin",
    nav: [
      { path: "", label: "Dashboard", element: <AdminDashboard />, end: true },
      { path: "companies", label: "Companies", element: <CompaniesPage /> },
      { path: "drivers", label: "Drivers", element: <DriversPage /> },
    ],
    children: [],
  },
  Company: {
    base: "/company",
    nav: [
      { path: "", label: "Dashboard", element: <CompanyDashboard />, end: true },
      { path: "profile", label: "Profile", element: <CompanyProfilePage /> },
      { path: "services", label: "Services", element: <CompanyServices /> },
      { path: "invites", label: "Invites", element: <CompanyInvitesPage /> },
      { path: "drivers", label: "Drivers", element: <CompanyDrivers /> },
      { path: "applications", label: "Applications", element: <CompanyApplicationsPage /> },
      { path: "transactions", label: "Transactions", element: <CompanyTransactions /> },
    ],
    children: [],
  },
  Driver: {
    base: "/driver",
    nav: [
      { path: "", label: "Dashboard", element: <DriverDashboard />, end: true },
      { path: "profile", label: "Profile", element: <DriverProfilePage /> },
      { path: "jobs", label: "Openings", element: <DriverJobsPage /> },
      { path: "invites", label: "Invites", element: <DriverInvitesPage /> },
      { path: "applications", label: "Applications", element: <DriverApplicationsPage /> },
      { path: "transactions", label: "Transactions", element: <DriverTransactions /> },
    ],
    children: [],
  },
  Rider: {
    base: "/",
    nav: [],
    children: [],
  },
};

/**
 * Helper: build SubNav links for a given role.
 * Returns items shaped for <SubNav /> consumption.
 */
export function buildNavLinks(role: Role) {
  const def = ROLE_ROUTES[role] ?? ROLE_ROUTES.Rider;
  return def.nav
    .filter((r) => r.label)
    .map((r) => ({
      to: (def.base.replace(/\/$/, "") + "/" + r.path).replace(/\/+$/, "") || "/",
      label: r.label!,
      end: r.end,
    }));
}
