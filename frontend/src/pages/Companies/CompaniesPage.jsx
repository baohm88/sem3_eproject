import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { listCompanies } from "../../api/companies.ts";
import { useAuth } from "../../context/AuthContext";
import PaginationBar from "../../components/common/PaginationBar";
import CompanyCard from "../../components/company/CompanyCard.jsx";
import CompanyCardSkeleton from "../../components/company/CompanyCardSkeleton.jsx";

export default function CompaniesPage() {
    const { profile } = useAuth();
    const isAdmin = profile?.role === "Admin";

    // dữ liệu
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);

    // bộ lọc & sắp xếp
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState("name:asc");
    const [statusFilter, setStatusFilter] = useState("");

    // phân trang
    const [page, setPage] = useState(1); // 1-based
    const [size, setSize] = useState(12);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // yêu thích (demo lưu local state)
    const [favorites, setFavorites] = useState([]);

    const navigate = useNavigate();

    // debounce cho search
    const [debouncedName, setDebouncedName] = useState(searchTerm);
    useEffect(() => {
        const t = setTimeout(() => setDebouncedName(searchTerm), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                sort,
                ...(debouncedName.trim() ? { name: debouncedName.trim() } : {}),
            };
            const res = await listCompanies(params);
            // res là PageResult<Company>
            setCompanies(res.items || []);
            setTotalItems(res.totalItems || 0);
            setTotalPages(res.totalPages || 0);
        } catch (err) {
            toast.error("Failed to fetch companies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedName, sort, page, size]);

    const toggleFavorite = (id) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <Container className="py-4">
            {/* Header & controls */}
            <Row className="mb-3 g-2 align-items-center">
                {/* Search by name */}
                <Col xs={12} md={5} lg={4}>
                    <Form.Control
                        type="search"
                        placeholder="Search by company name…"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1); // reset về trang 1 khi đổi search
                        }}
                    />
                </Col>

                {/* Sort */}
                <Col xs={12} md={4} lg={3}>
                    <Form.Select
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1); // reset về trang 1 khi đổi sort
                        }}
                        aria-label="Sort companies"
                    >
                        <option value="name:asc">Name ↑</option>
                        <option value="name:desc">Name ↓</option>
                        <option value="rating:asc">Rating ↑</option>
                        <option value="rating:desc">Rating ↓</option>
                        <option value="membership:asc">Membership ↑</option>
                        <option value="membership:desc">Membership ↓</option>
                    </Form.Select>
                </Col>

                {isAdmin && (
                    <>
                        {/* Status filter (tuỳ chọn) */}
                        <Col xs={6} md={3}>
                            <Form.Select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                aria-label="Filter by status"
                            >
                                <option value="">All statuses</option>
                                <option value="active">Active only</option>
                                <option value="inactive">Inactive only</option>
                            </Form.Select>
                        </Col>
                        <Col xs={12} md="auto" className="text-md-end">
                            <Button variant="success">+ Add Company</Button>
                        </Col>
                    </>
                )}
            </Row>

            {/* Grid cards */}
            {loading ? (
                <Row className="g-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Col xs={12} md={6} lg={4} key={`sk-${i}`}>
                            <CompanyCardSkeleton />
                        </Col>
                    ))}
                </Row>
            ) : (
                <>
                    <Row className="g-4">
                        {companies.map((c) => (
                            <Col xs={12} md={6} lg={4} key={c.id}>
                                <CompanyCard
                                    company={c}
                                    isFavorite={favorites.includes(c.id)}
                                    onToggleFavorite={() =>
                                        toggleFavorite(c.id)
                                    }
                                    onClick={() =>
                                        navigate(`/companies/${c.id}`)
                                    }
                                    showDescription={true}
                                    showStatusBadges={true}
                                    imgHeight={200}
                                />
                            </Col>
                        ))}
                        {!companies.length && (
                            <Col
                                xs={12}
                                className="text-center text-muted py-5"
                            >
                                No companies found.
                            </Col>
                        )}
                    </Row>

                    {/* Pagination */}
                    <div className="mt-4">
                        <PaginationBar
                            page={page}
                            size={size}
                            totalItems={totalItems}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                            onSizeChange={(s) => {
                                setSize(s);
                                setPage(1); // reset về trang 1 khi đổi page size
                            }}
                            sizeOptions={[1, 2, 3]}
                        />
                    </div>
                </>
            )}
        </Container>
    );
}
