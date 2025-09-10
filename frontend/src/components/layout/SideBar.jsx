import {
  Offcanvas,
  Nav,
  Button,
  NavDropdown,
  Image,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Mobile-only sidebar (Offcanvas).
 * Links at the top; account dropdown (or Login button) pinned to the bottom.
 */
export default function SideBar({ show, handleClose, links = [] }) {
  const { profile, isAuthenticated, logout } = useAuth();

  // Dashboard path by role (fallback "/")
  const DASH_BY_ROLE = {
    Admin: "/admin",
    Company: "/company",
    Driver: "/driver",
    Rider: "/",
  };
  const dashboardTo = DASH_BY_ROLE[profile?.role] || "/";

  return (
    <Offcanvas show={show} onHide={handleClose} className="d-md-none">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <img
            src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
            alt="AutoBid"
            height={40}
          />
        </Offcanvas.Title>
      </Offcanvas.Header>

      {/* Make the body a flex column so we can push the bottom section with mt-auto */}
      <Offcanvas.Body className="d-flex flex-column h-100">
        {/* Primary nav links */}
        <Nav className="flex-column mb-3">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link py-2 ${isActive ? "text-danger fw-bold" : "text-dark"}`
              }
              onClick={handleClose}
            >
              {label}
            </NavLink>
          ))}
        </Nav>

        {/* Bottom section: account dropdown OR login button */}
        <div className="mt-auto border-top pt-3">
          {isAuthenticated ? (
            <Nav>
              <NavDropdown
                align="end"
                id="sidebar-user-dropdown"
                title={
                  <span className="d-inline-flex align-items-center gap-2">
                    <Image
                      src={
                        profile?.imgUrl ||
                        "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png"
                      }
                      roundedCircle
                      height={30}
                      width={30}
                    />
                    <span className="small text-muted">
                      {profile?.email || "Account"}
                    </span>
                  </span>
                }
              >
                <NavDropdown.Item disabled className="small text-muted">
                  {profile?.email || "Account"}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to={dashboardTo} onClick={handleClose}>
                  <i className="bi bi-clipboard-data-fill me-2" />
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to={`/${profile?.role?.toLowerCase?.()}/profile`}
                  onClick={handleClose}
                >
                  <i className="bi bi-heart-fill me-2 text-danger" />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  as="button"
                  onClick={() => {
                    logout();
                    handleClose();
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Button
              variant="success"
              className="w-100"
              as={NavLink}
              to="/login"
              onClick={handleClose}
            >
              <i className="bi bi-box-arrow-left me-2" />
              Login
            </Button>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
