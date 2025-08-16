export const navLinks = {
    Admin: [
        { to: "/admin", label: "Home", end: true },
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/ads", label: "Ads" },
        { to: "/admin/payments", label: "Payments" },
        { to: "/admin/feedbacks", label: "Feedbacks" },
    ],
    Company: [
        { to: "/company/dashboard", label: "Dashboard" },
        { to: "/company/ads", label: "Ads" },
        { to: "/company/payments", label: "Payments" },
    ],
    Driver: [
        { to: "/driver/companies", label: "Companies" },
        { to: "/company/payments", label: "Payments" },
    ],
    User: [
        { to: "/drivers", label: "Drivers" },
        { to: "/companies", label: "Companies" },
        // { to: "/login", label: "Login" },
        // { to: "/register", label: "Register" },
    ],
};
