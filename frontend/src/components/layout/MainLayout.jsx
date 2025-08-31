import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { buildNavLinks } from "../../constants/routes.tsx";
import NavBar from "./NavBar";

export default function MainLayout() {
    const { profile } = useAuth();
    const role = profile?.role || "Rider";
    const links = buildNavLinks(role);

    return (
        <div className="app-layout">
            <NavBar links={links} />
            <main className="container">
                <Outlet />
            </main>
        </div>
    );
}
