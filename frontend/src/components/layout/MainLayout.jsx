import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { navLinks } from "../../constants/navLinks";
import NavBar from "./NavBar";

export default function MainLayout() {
  // const { user } = useAuth();
  const user = {
    name: "ABC",
    role: "User",
  };

  return (
    <div className="app-layout">
      <NavBar links={navLinks[user?.role || "User"]} />
      {/* <Sidebar links={navLinks[user?.role || "User"]} /> */}
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}
