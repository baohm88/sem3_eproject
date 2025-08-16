import DriverTable from "../../components/drivers/DriverTable";
import { useAuth } from "../../context/AuthContext";
import { Container } from "react-bootstrap";
import DriverForm from "../../components/drivers/DriverForm";

export default function DriversPage() {
    const { user } = useAuth();
    const role = user?.role || "Guest";

    return (
        <Container className="py-4">
            <h2 className="mb-4">Drivers</h2>

            {/* Ai cũng có thể xem danh sách */}
            <DriverTable
                canEdit={role === "Admin"}
                canDelete={role === "Admin"}
            />

            {/* Chỉ Admin mới có quyền thêm mới */}
            {role === "Admin" && (
                <div className="mt-4">
                    <h4>Add New Driver</h4>
                    <DriverForm />
                </div>
            )}
        </Container>
    );
}
