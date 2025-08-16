export const navLinks = {
    Admin: [
        { to: "/admin", label: "Home", end: true },
        { to: "/admin/ads", label: "Ads" },
        { to: "/admin/payments", label: "Payments" },
        { to: "/admin/feedbacks", label: "Feedbacks" },
        { to: "/admin/companies", label: "Companies" },
        { to: "/admin/drivers", label: "Drivers" },
    ],
    Company: [
        { to: "/company", label: "Dashboard" },
        { to: "/company/ads", label: "Ads" },
        { to: "/company/payments", label: "Payments" },
        { to: "/company/drivers", label: "Drivers" },
        
    ],
    Driver: [
        { to: "/driver/drivers", label: "Companies" },
        { to: "/company/payments", label: "Payments" },
    ],
    User: [
        { to: "/drivers", label: "Drivers" },
        { to: "/companies", label: "Companies" },
    ],
};
