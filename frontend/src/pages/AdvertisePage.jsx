import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

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

        // ✅ MVP: chuyển thẳng về Service Manager
        navigate("/company/services?from=advertise", { replace: true });
    }, [isAuthenticated, profile, navigate]);

    // Render “trống” vì sẽ redirect ngay
    return null;
}
