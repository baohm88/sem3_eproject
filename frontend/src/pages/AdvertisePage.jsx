// src/pages/AdvertisePage.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

/**
 * AdvertisePage
 * - Guarded route for Company users.
 * - If not authenticated: notify and redirect to /login (preserve intended path).
 * - If authenticated but not a Company: notify and redirect to /unauthorized.
 * - Otherwise (MVP): redirect straight to the Company's Service Manager.
 */
export default function AdvertisePage() {
  const { isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please log in as a Company to advertise.");
      navigate("/login", {
        replace: true,
        state: { from: "/advertise" },
      });
      return;
    }
    if (profile?.role !== "Company") {
      toast.error("Only companies can access Advertise.");
      navigate("/unauthorized", { replace: true });
      return;
    }

    // MVP: redirect straight to Service Manager
    navigate("/company/services?from=advertise", { replace: true });
  }, [isAuthenticated, profile, navigate]);

  // Render nothing because we redirect immediately
  return null;
}
