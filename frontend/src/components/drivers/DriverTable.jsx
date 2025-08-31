import { useEffect, useState } from "react";
import {
    Table,
    Form,
    Button,
    InputGroup,
    Pagination,
    Row,
    Col,
} from "react-bootstrap";
import { listDrivers } from "../../api/drivers.ts";
import { toast } from "react-toastify";

export default function DriverTable({ canEdit, canDelete }) {
    const [drivers, setDrivers] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Fetch data từ API
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const res = await listDrivers();
                console.log(res);

                setDrivers(res.data || []);
                setFilteredDrivers(res.data || []);
            } catch (err) {
                console.log("Failed to load drivers:", err.message);

                toast.error("Failed to load drivers.");
            }
        };
        fetchDrivers();
    }, []);

    // Search + Filter
    useEffect(() => {
        let result = drivers;

        if (search) {
            result = result.filter((d) =>
                d.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter((d) => d.status === statusFilter);
        }

        setFilteredDrivers(result);
        setCurrentPage(1);
    }, [search, statusFilter, drivers]);

    // Pagination
    const totalPages = Math.ceil(filteredDrivers.length / pageSize);
    const paginatedDrivers = filteredDrivers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this driver?")) return;
        try {
            await axiosClient.delete(`/drivers/${id}`);
            toast.success("Driver deleted.");
            setDrivers(drivers.filter((d) => d.id !== id));
        } catch (err) {
            toast.error("Failed to delete driver.");
        }
    };

    return (
        <div>
            {/* Search + Filter */}
            <Row className="mb-3">
                <Col md={6}>
                    <InputGroup>
                        <Form.Control
                            placeholder="Search drivers by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => setSearch("")}
                        >
                            Clear
                        </Button>
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Table */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>License</th>
                        <th>Status</th>
                        {canEdit || canDelete ? <th>Actions</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {paginatedDrivers.length > 0 ? (
                        paginatedDrivers.map((d) => (
                            <tr key={d.id}>
                                <td>{d.name}</td>
                                <td>{d.licenseNumber}</td>
                                <td>
                                    <span
                                        className={
                                            d.status === "active"
                                                ? "text-success"
                                                : "text-danger"
                                        }
                                    >
                                        {d.status}
                                    </span>
                                </td>
                                {canEdit || canDelete ? (
                                    <td>
                                        {canEdit && (
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        {canDelete && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(d.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </td>
                                ) : null}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">
                                No drivers found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination>
                <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                />
                {[...Array(totalPages).keys()].map((n) => (
                    <Pagination.Item
                        key={n + 1}
                        active={n + 1 === currentPage}
                        onClick={() => setCurrentPage(n + 1)}
                    >
                        {n + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                />
            </Pagination>
        </div>
    );
}
