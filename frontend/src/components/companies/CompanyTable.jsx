import { Table, Button, Form, Row, Col, Spinner } from "react-bootstrap";

export default function CompanyTable({
    companies,
    loading,
    onEdit,
    onDelete,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
}) {
    return (
        <>
            {/* Search + Filter */}
            <Row className="mb-3">
                <Col md={6} className="mb-2">
                    <Form.Control
                        type="text"
                        placeholder="Search companies by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={4} className="mb-2">
                    <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Form.Select>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Company Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            {onEdit && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {companies.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={onEdit ? 5 : 4}
                                    className="text-center"
                                >
                                    No companies found
                                </td>
                            </tr>
                        ) : (
                            companies.map((company, idx) => (
                                <tr key={company.id}>
                                    <td>{idx + 1}</td>
                                    <td>{company.name}</td>
                                    <td>{company.email}</td>
                                    <td
                                        className={
                                            company.status === "active"
                                                ? "text-success fw-bold"
                                                : "text-danger fw-bold"
                                        }
                                    >
                                        {company.status}
                                    </td>
                                    {onEdit && (
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                className="me-2"
                                                onClick={() => onEdit(company)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() =>
                                                    onDelete(company.id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </>
    );
}
