import { Link, NavLink, useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import SideBar from "./SideBar";

export default function NavBar({ links = [] }) {
    const { profile, isAuthenticated, logout } = useAuth();
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            navigate("/");
        }
    };

    const toggleSidebar = () => setShowSidebar((prev) => !prev);

    const DASH_BY_ROLE = {
        Admin: "/admin",
        Company: "/company",
        Driver: "/driver",
        Rider: "/",
    };
    const dashboardTo = DASH_BY_ROLE[profile?.role] || "/";

    return (
        <>
            <header>
                <Navbar bg="light" className="shadow-sm">
                    <Container className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                            {/* Menu icon (mobile) */}
                            <RiMenu2Line
                                className="fs-3 d-md-none text-danger"
                                onClick={toggleSidebar}
                                style={{ cursor: "pointer" }}
                            />
                            <Navbar.Brand
                                as={NavLink}
                                to="/"
                                className="d-none d-md-block"
                            >
                                <img
                                    src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
                                    alt="AutoBid"
                                    height={50}
                                />
                            </Navbar.Brand>

                            {/* Hide links on mobile */}
                            <div className="d-none d-md-flex">
                                {links.map(({ to, label, end }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        end={end}
                                        className={({ isActive }) =>
                                            `nav-link d-flex align-items-center gap- m-2 ${
                                                isActive
                                                    ? "text-primary fw-bold"
                                                    : "text-muted"
                                            }`
                                        }
                                    >
                                        {label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        {/* Centered brand on mobile */}
                        <Navbar.Brand
                            as={NavLink}
                            to="/"
                            className="mx-auto d-md-none"
                        >
                            <img
                                src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
                                alt="AutoBid"
                                height={30}
                            />
                        </Navbar.Brand>

                        {/* Search bar (hidden on small) */}
                        <Form
                            className="d-none d-md-flex w-50 mx-auto"
                            onKeyPress={handleKeyPress}
                        >
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
                            <div className="d-flex align-items-center gap-3">
                                <i className="bi bi-bell-fill fs-5 text-muted"></i>
                                <Nav>
                                    <NavDropdown
                                        align="end"
                                        title={
                                            <Image
                                                src={
                                                    profile.imgUrl ||
                                                    "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png"
                                                }
                                                roundedCircle
                                                height={30}
                                                width={30}
                                            />
                                        }
                                        id="user-dropdown"
                                    >
                                        <NavDropdown.Item
                                            disabled
                                            className="small text-muted"
                                        >
                                            {profile?.email || "Account"}
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to={dashboardTo}
                                        >
                                            <i className="bi bi-clipboard-data-fill me-2" />
                                            Dashboard
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to={`${profile.role}/profile`}
                                        >
                                            <i className="bi bi-heart-fill me-2 text-danger" />
                                            Profile
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            as="button"
                                            onClick={logout}
                                        >
                                            <i className="bi bi-box-arrow-right me-2" />
                                            Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </div>
                        ) : (
                            <Button variant="success" size="sm">
                                <NavLink
                                    className="nav-link text-white"
                                    to="/login"
                                >
                                    <i className="bi bi-box-arrow-left me-2"></i>
                                    Login
                                </NavLink>
                            </Button>
                        )}
                    </Container>
                </Navbar>
            </header>

            {/* SideBar for mobile */}
            <SideBar
                show={showSidebar}
                handleClose={() => setShowSidebar(false)}
                links={links}
            />
        </>
    );
}
