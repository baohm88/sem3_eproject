// src/components/layout/MainLayout.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Button,
  NavDropdown,
  Image,
} from "react-bootstrap";
import { RiMenu2Line } from "react-icons/ri";

import { useAuth } from "../../context/AuthContext";
import SideBar from "./SideBar";
import SubNav from "./SubNav";
import {
  PUBLIC_ROUTES,
  buildNavLinks,
  ROLE_ROUTES,
  type Role,
  type RouteItem,
} from "../../routes/routes";

type LinkItem = { to: string; label: string; end?: boolean };

const NAVBAR_HEIGHT = 80;

/**
 * MainLayout
 * - Fixed top main navbar + optional sticky SubNav (role-scoped).
 * - Measures SubNav height dynamically (responsive changes) and inserts spacers
 *   so page content (Outlet) is not overlapped.
 * - Provides mobile sidebar, role-aware links, and a user dropdown.
 */
export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated, logout } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Measure actual SubNav height (in case of responsive layout changes)
  const subnavRef = useRef<HTMLDivElement | null>(null);
  const [subnavHeight, setSubnavHeight] = useState(44); // default rough estimate

  useEffect(() => {
    const measure = () => {
      if (subnavRef.current) {
        const h = subnavRef.current.getBoundingClientRect().height || 0;
        setSubnavHeight(Math.round(h));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // Re-measure when route changes (SubNav content/visibility can differ by route)
  }, [location.pathname]);

  const links: LinkItem[] = useMemo(
    () =>
      PUBLIC_ROUTES.filter((r) => !!r.label).map((r: RouteItem) => ({
        to: r.path,
        label: r.label!,
        end: r.end,
      })),
    []
  );

  const role = (profile?.role as Role) ?? ("Rider" as Role);
  const roleBase = ROLE_ROUTES[role]?.base ?? "/";
  const showSubNav =
    (location.pathname === roleBase ||
      location.pathname.startsWith(roleBase + "/")) &&
    ["Admin", "Company", "Driver"].includes(role);

  const subLinks = useMemo(() => buildNavLinks(role), [role]);

  const DASH_BY_ROLE: Record<Role | "Guest" | undefined, string> = {
    Admin: "/admin",
    Company: "/company",
    Driver: "/driver",
    Rider: "/",
    Guest: "/",
    undefined: "/",
  };
  const dashboardTo = DASH_BY_ROLE[(profile?.role as Role) ?? "Guest"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") navigate("/");
  };
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <>
      {/* MAIN NAV - fixed top */}
      <header>
        <Navbar
          bg="light"
          className="shadow-sm"
          expand="md"
          fixed="top" // fixed at the very top
        >
          <Container className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <RiMenu2Line
                className="fs-3 d-md-none text-danger"
                onClick={toggleSidebar}
                style={{ cursor: "pointer" }}
              />
              <Navbar.Brand as={NavLink} to="/" className="d-none d-md-block">
                <img
                  src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
                  alt="AutoBid"
                  height={50}
                />
              </Navbar.Brand>
              <div className="d-none d-md-flex">
                {links.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
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

            {isAuthenticated ? (
              <div className="d-none d-md-flex align-items-center gap-3">
                <Nav>
                  <NavDropdown
                    align="end"
                    show={showDropdown} // controlled show/hide
                    onMouseEnter={() => setShowDropdown(true)} // open on hover
                    onMouseLeave={() => setShowDropdown(false)} // close on hover out
                    onToggle={() => {}} // keep behavior strictly controlled
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
                    <NavDropdown.Item as={NavLink} to={dashboardTo} end>
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
      </header>

      {/* Spacer under fixed Navbar to prevent content from being overlapped */}
      <div style={{ height: NAVBAR_HEIGHT }} />

      {/* SUB NAV - sticky directly under MainNav */}
      {showSubNav && (
        <>
          <div
            ref={subnavRef}
            className="sticky-top bg-white border-bottom"
            style={{ top: NAVBAR_HEIGHT, zIndex: 1020 }}
          >
            <SubNav links={subLinks} role={role} />
          </div>

          {/* Spacer under SubNav so the top of <Outlet /> isn't hidden.
              On scroll, SubNav will overlay content (intended behavior). */}
          <div style={{ height: subnavHeight }} />
        </>
      )}

      {/* SideBar for mobile */}
      <SideBar
        show={showSidebar}
        handleClose={() => setShowSidebar(false)}
        links={links}
      />

      {/* Main content area */}
      <main className="container py-3">
        <Outlet />
      </main>
    </>
  );
}

