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

export default function NavBar({ links = [] }) {
    const { user, isAuthenticated, logout } = useAuth();
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    console.log(isAuthenticated);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            navigate("/");
        }
    };

    const toggleSidebar = () => setShowSidebar((prev) => !prev);
    return (
        <>
            <header>
                <Navbar bg="light" className="shadow-sm">
                    <Container className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
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

                            {links.map(({ to, label, end }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    className={({ isActive }) =>
                                        `nav-link d-flex align-items-center gap-2 mb-2 ${
                                            isActive
                                                ? "text-danger fw-bold"
                                                : "text-muted"
                                        }`
                                    }
                                >
                                    {label}
                                </NavLink>
                            ))}
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
                                placeholder="Search for taxi companies (ex. Xanh SM)"
                                className="me-2"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </Form>

                        {/* User controls */}
                        {isAuthenticated ? (
                            <div className="d-flex align-items-center gap-3">
                                <i className="bi bi-bell-fill fs-5 text-muted"></i>
                                <Nav>
                                    <NavDropdown
                                        align="end"
                                        title={
                                            <Image
                                                src={
                                                    user.image_url ||
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
                                            as={NavLink}
                                            to="/account/dashboard"
                                        >
                                            <i className="bi bi-clipboard-data-fill me-2" />
                                            Dashboard
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            as={NavLink}
                                            to="/account/watch-list"
                                        >
                                            <i className="bi bi-heart-fill me-2 text-danger" />
                                            Watch List
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
        </>
    );
}
