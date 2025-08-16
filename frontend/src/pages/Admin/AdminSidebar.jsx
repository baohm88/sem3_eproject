import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

export default function AdminSidebar() {
    return (
        <div>
            <h4 className="mb-4">Admin Panel</h4>
            <Nav className="flex-column gap-2">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        `nav-link ${
                            isActive ? "fw-bold text-danger" : "text-muted"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/companies"
                    className={({ isActive }) =>
                        `nav-link ${
                            isActive ? "fw-bold text-danger" : "text-muted"
                        }`
                    }
                >
                    Manage Companies
                </NavLink>

                <NavLink
                    to="/admin/drivers"
                    className={({ isActive }) =>
                        `nav-link ${
                            isActive ? "fw-bold text-danger" : "text-muted"
                        }`
                    }
                >
                    Manage Drivers
                </NavLink>
            </Nav>
        </div>
    );
}
