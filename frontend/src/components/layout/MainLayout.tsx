// import { useMemo, useState } from "react";
// import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
// import {
//   Navbar, Nav, Container, Button, Form, FormControl, NavDropdown, Image,
// } from "react-bootstrap";
// import { RiMenu2Line } from "react-icons/ri";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/AuthContext";
// import SideBar from "./SideBar";
// import { PUBLIC_ROUTES, type RouteItem, type Role, buildNavLinks } from "../../routes/routes";
// import SubNav from "./SubNav"; 

// type LinkItem = { to: string; label: string; end?: boolean };

// export default function MainLayout() {
//   const { profile, isAuthenticated, logout } = useAuth();
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   // public links trên thanh chính
//   const links: LinkItem[] = useMemo(
//     () =>
//       PUBLIC_ROUTES.filter((r) => !!r.label).map((r: RouteItem) => ({
//         to: r.path,
//         label: r.label!,
//         end: r.end,
//       })),
//     []
//   );

// // sub links theo role cho thanh dưới
// const subLinks = useMemo(
//   () => buildNavLinks((profile?.role as Role) ?? "Rider"),
//   [profile?.role]
// );

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setSearchTerm(e.target.value);

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && searchTerm.trim() !== "") navigate("/");
//   };

//   const toggleSidebar = () => setShowSidebar((prev) => !prev);

//   const DASH_BY_ROLE: Record<Role | "Guest" | undefined, string> = {
//     Admin: "/admin", Company: "/company", Driver: "/driver", Rider: "/", Guest: "/", undefined: "/",
//   };
//   const dashboardTo = DASH_BY_ROLE[(profile?.role as Role) ?? "Guest"];

//   const onClickNav = (to: string, e?: React.MouseEvent) => {
//     if (to === "/advertise") {
//       if (!isAuthenticated) { e?.preventDefault(); navigate("/login", { state: { from: location } }); return; }
//       if (profile?.role !== "Company") { e?.preventDefault(); toast.error("Only companies can access Advertise"); return; }
//     }
//   };

//   return (
//     <>
//       <header>
//         {/* MAIN NAV */}
//         <Navbar bg="light" className="shadow-sm" expand="md">
//           <Container className="d-flex justify-content-between align-items-center">
//             <div className="d-flex align-items-center gap-3">
//               <RiMenu2Line className="fs-3 d-md-none text-danger" onClick={toggleSidebar} style={{ cursor: "pointer" }} />
//               <Navbar.Brand as={NavLink} to="/" className="d-none d-md-block">
//                 <img src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png" alt="AutoBid" height={50} />
//               </Navbar.Brand>
//               <div className="d-none d-md-flex">
//                 {links.map(({ to, label, end }) => (
//                   <NavLink
//                     key={to} to={to} end={end}
//                     onClick={(e) => onClickNav(to, e)}
//                     className={({ isActive }) => `nav-link d-flex align-items-center m-2 ${isActive ? "text-primary fw-bold" : "text-muted"}`}
//                   >
//                     {label}
//                   </NavLink>
//                 ))}
//               </div>
//             </div>

//             <Navbar.Brand as={NavLink} to="/" className="mx-auto d-md-none">
//               <img src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png" alt="AutoBid" height={30} />
//             </Navbar.Brand>

//             <Form className="d-none d-md-flex w-50 mx-auto" onKeyPress={handleKeyPress}>
//               <FormControl type="search" placeholder="Search taxi companies (ex. Xanh SM)" className="me-2" value={searchTerm} onChange={handleSearchChange} />
//             </Form>

//             {isAuthenticated ? (
//               <div className="d-none d-md-flex align-items-center gap-3">
//                 <i className="bi bi-bell-fill fs-5 text-muted" />
//                 <Nav>
//                   <NavDropdown
//                     align="end"
//                     title={
//                       <Image
//                         src={(profile as any)?.imgUrl || "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png"}
//                         roundedCircle height={30} width={30}
//                       />
//                     }
//                     id="user-dropdown"
//                   >
//                     <NavDropdown.Item disabled className="small text-muted">
//                       {(profile as any)?.email || "Account"}
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} to={dashboardTo}>
//                       <i className="bi bi-clipboard-data-fill me-2" />
//                       Dashboard
//                     </NavDropdown.Item>
//                     <NavDropdown.Item as={NavLink} to={`/${(profile as any)?.role?.toLowerCase?.()}/profile`}>
//                       <i className="bi bi-heart-fill me-2 text-danger" />
//                       Profile
//                     </NavDropdown.Item>
//                     <NavDropdown.Item as="button" onClick={logout}>
//                       <i className="bi bi-box-arrow-right me-2" />
//                       Logout
//                     </NavDropdown.Item>
//                   </NavDropdown>
//                 </Nav>
//               </div>
//             ) : (
//               <Button variant="success" size="sm" as={NavLink} to="/login">
//                 <i className="bi bi-box-arrow-left me-2"></i> Login
//               </Button>
//             )}
//           </Container>
//         </Navbar>

//       {/* SUB NAV (role-based) */}
//       {subLinks.length > 0 && <SubNav links={subLinks} />}
//       </header>

//       {/* SideBar for mobile (public links) */}
//       <SideBar show={showSidebar} handleClose={() => setShowSidebar(false)} links={links} />

//       <main className="container py-3">
//         <Outlet />
//       </main>
//     </>
//   );
// }


import { useMemo, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Form,
  FormControl,
  NavDropdown,
  Image,
} from "react-bootstrap";
import { RiMenu2Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import SideBar from "./SideBar";
import SubNav from "./SubNav";
import {
  PUBLIC_ROUTES,
  ROLE_ROUTES,
  buildNavLinks,
  type RouteItem,
  type Role,
} from "../../routes/routes";

type LinkItem = { to: string; label: string; end?: boolean };

export default function MainLayout() {
  const { profile, isAuthenticated, logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Main nav (public) links
  const links: LinkItem[] = useMemo(
    () =>
      PUBLIC_ROUTES.filter((r) => !!r.label).map((r: RouteItem) => ({
        to: r.path,
        label: r.label!,
        end: r.end,
      })),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate("/");
    }
  };

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  const DASH_BY_ROLE: Record<Role | "Guest" | undefined, string> = {
    Admin: "/admin",
    Company: "/company",
    Driver: "/driver",
    Rider: "/",
    Guest: "/",
    undefined: "/",
  };
  const role = (profile?.role as Role) ?? "Rider";
  const dashboardTo = DASH_BY_ROLE[(profile?.role as Role) ?? "Guest"];

  const onClickNav = (to: string, e?: React.MouseEvent) => {
    // Guard cho /advertise
    if (to === "/advertise") {
      if (!isAuthenticated) {
        e?.preventDefault();
        navigate("/login", { state: { from: location } });
        return;
      }
      if (profile?.role !== "Company") {
        e?.preventDefault();
        toast.error("Only companies can access Advertise");
        return;
      }
    }
  };

  // ========== SubNav visibility ==========
  const roleBase = ROLE_ROUTES[role]?.base ?? "/";
  const showSubNav = useMemo(() => {
    // Chỉ hiển thị nếu path bắt đầu bằng base của role hiện tại
    if (!roleBase || roleBase === "/") return false;
    const path = location.pathname.toLowerCase();
    const base = roleBase.toLowerCase().replace(/\/+$/, "");
    return path === base || path.startsWith(base + "/");
  }, [location.pathname, roleBase]);

  const subLinks = useMemo(() => (showSubNav ? buildNavLinks(role) : []), [showSubNav, role]);

  return (
    <>
      <header>
        <Navbar bg="light" className="shadow-sm" expand="md">
          <Container className="d-flex justify-content-between align-items-center">
            {/* Left: menu + brand */}
            <div className="d-flex align-items-center gap-3">
              {/* Menu icon (mobile) */}
              <RiMenu2Line
                className="fs-3 d-md-none text-danger"
                onClick={toggleSidebar}
                style={{ cursor: "pointer" }}
              />

              {/* Brand (hidden on mobile) */}
              <Navbar.Brand as={NavLink} to="/" className="d-none d-md-block">
                <img
                  src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
                  alt="AutoBid"
                  height={50}
                />
              </Navbar.Brand>

              {/* Links (hidden on mobile) */}
              <div className="d-none d-md-flex">
                {links.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={(e) => onClickNav(to, e)}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center m-2 ${
                        isActive ? "text-primary fw-bold" : "text-muted"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Center brand on mobile */}
            <Navbar.Brand as={NavLink} to="/" className="mx-auto d-md-none">
              <img
                src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
                alt="AutoBid"
                height={30}
              />
            </Navbar.Brand>

            {/* Search (desktop only) */}
            <Form className="d-none d-md-flex w-50 mx-auto" onKeyPress={handleKeyPress}>
              <FormControl
                type="search"
                placeholder="Search taxi companies (ex. Xanh SM)"
                className="me-2"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form>

            {/* User controls (desktop only) */}
            {isAuthenticated ? (
              <div className="d-none d-md-flex align-items-center gap-3">
                <i className="bi bi-bell-fill fs-5 text-muted" />
                <Nav>
                  <NavDropdown
                    align="end"
                    title={
                      <Image
                        src={
                          (profile as any)?.imgUrl ||
                          "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png"
                        }
                        roundedCircle
                        height={30}
                        width={30}
                      />
                    }
                    id="user-dropdown"
                  >
                    <NavDropdown.Item disabled className="small text-muted">
                      {(profile as any)?.email || "Account"}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={NavLink} to={dashboardTo}>
                      <i className="bi bi-clipboard-data-fill me-2" />
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={NavLink}
                      to={`/${(profile as any)?.role?.toLowerCase?.()}/profile`}
                    >
                      <i className="bi bi-heart-fill me-2 text-danger" />
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as="button" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2" />
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </div>
            ) : (
              <Button variant="success" size="sm" as={NavLink} to="/login">
                <i className="bi bi-box-arrow-left me-2"></i>
                Login
              </Button>
            )}
          </Container>
        </Navbar>

        {/* SubNav chỉ hiện khi ở trong base của role hiện tại */}
        {showSubNav && <SubNav links={subLinks} role={role} />}
      </header>

      {/* SideBar for mobile */}
      <SideBar
        show={showSidebar}
        handleClose={() => setShowSidebar(false)}
        links={links}
      />

      <main className="container py-3">
        <Outlet />
      </main>
    </>
  );
}
