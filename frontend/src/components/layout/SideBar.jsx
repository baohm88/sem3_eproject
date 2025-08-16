import { Offcanvas, Nav, Button, Form, FormControl } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function SideBar({ show, handleClose, links = [] }) {
    const { user, isAuthenticated, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            navigate("/");
            handleClose();
        }
    };

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

            <Offcanvas.Body>
                {/* Search bar */}
                <Form className="d-flex mb-3" onKeyPress={handleKeyPress}>
                    <FormControl
                        type="search"
                        placeholder="Search taxi companies (ex. Xanh SM)"
                        className="me-2"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Form>

                {/* Nav Links */}
                <Nav className="flex-column mb-3">
                    {links.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `nav-link py-2 ${
                                    isActive
                                        ? "text-danger fw-bold"
                                        : "text-dark"
                                }`
                            }
                            onClick={handleClose}
                        >
                            {label}
                        </NavLink>
                    ))}
                </Nav>

                {/* Auth buttons */}
                {isAuthenticated ? (
                    <Button
                        variant="outline-danger"
                        className="w-100"
                        onClick={() => {
                            logout();
                            handleClose();
                        }}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                    </Button>
                ) : (
                    <Button
                        variant="success"
                        className="w-100"
                        as={NavLink}
                        to="/login"
                        onClick={handleClose}
                    >
                        <i className="bi bi-box-arrow-left me-2"></i>
                        Login
                    </Button>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
}
