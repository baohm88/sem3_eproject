import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { listCompanies } from "../../api/companies.ts";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import CompanyTable from "../../components/companies/CompanyTable";
import CompanyForm from "../../components/companies/CompanyForm";

export default function CompaniesPage() {
    const { user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const isAdmin = user?.role === "Admin";

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const res = await listCompanies();
            console.log("list companies: ", res);

            setCompanies(res.items || []);
        } catch (err) {
            toast.error("Failed to fetch companies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [searchTerm, statusFilter]);

    const handleAdd = () => {
        setEditingCompany(null);
        setShowModal(true);
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this company?"))
            return;
        try {
            await axiosClient.delete(`/companies/${id}`);
            toast.success("Company deleted successfully");
            fetchCompanies();
        } catch (err) {
            toast.error("Failed to delete company");
        }
    };

    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col>
                    <h2>Companies</h2>
                </Col>
                {isAdmin && (
                    <Col className="text-end">
                        <Button variant="success" onClick={handleAdd}>
                            + Add Company
                        </Button>
                    </Col>
                )}
            </Row>

            <CompanyTable
                companies={companies}
                loading={loading}
                onEdit={isAdmin ? handleEdit : null}
                onDelete={isAdmin ? handleDelete : null}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            {/* Modal Add/Edit */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingCompany ? "Edit Company" : "Add Company"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CompanyForm
                        initialData={editingCompany}
                        onSuccess={() => {
                            setShowModal(false);
                            fetchCompanies();
                        }}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
}
