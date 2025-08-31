import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { navLinks } from "../../constants/navLinks";
import NavBar from "./NavBar";

export default function MainLayout() {
    const { user } = useAuth();

    return (
        <div className="app-layout">
            <NavBar links={navLinks[user?.role || "Rider"]} />

            <main className="container">
                <Outlet />
            </main>
        </div>
    );
}
