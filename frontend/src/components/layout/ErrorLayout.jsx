import { Container, Button } from "react-bootstrap";
import { useNavigate, Outlet } from "react-router-dom";

export default function ErrorLayout() {
    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
            <div className="mb-4">
                <img
                    src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
                    alt="AutoBid"
                    height={60}
                />
            </div>

            <Outlet />

            <div className="mt-4">
                <Button variant="primary" onClick={() => navigate("/")}>
                    Go Back Home
                </Button>
            </div>
        </Container>
    );
}
