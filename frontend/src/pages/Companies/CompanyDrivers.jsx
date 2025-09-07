import { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

import { getMyCompany, listCompanyDrivers } from "../../api/companies";
import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";
import DriverCard from "../../components/driver/DriverCard";

export default function CompanyDrivers() {
    const { profile } = useAuth();
    const [companyId, setCompanyId] = useState(null);

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        size: 3,
        totalPages: 1,
        totalItems: 0,
    });

    // filters
    const [q, setQ] = useState("");
    const [status, setStatus] = useState(""); // available / offline
    const [minRating, setMinRating] = useState("");
    const [sort, setSort] = useState("joinedAt:desc");

    const debounced = useRef(null);

    // load my company id
    useEffect(() => {
        if (profile?.role !== "Company") return;
        (async () => {
            try {
                const me = await getMyCompany();
                setCompanyId(me.id);
            } catch (e) {
                toast.error("Không lấy được company id");
            }
        })();
    }, [profile]);

    const fetchDrivers = async (p = 1, s = pageInfo.size) => {
        if (!companyId) return;
        setLoading(true);
        try {
            const res = await listCompanyDrivers(companyId, {
                page: p,
                size: s,
                sort,
                name: q || undefined,
                isAvailable: status ? status === "available" : undefined,
                minRating: minRating ? Number(minRating) : undefined,
            });
            setDrivers(res.items || []);
            setPageInfo({
                page: res.page,
                size: res.size,
                totalPages: res.totalPages,
                totalItems: res.totalItems,
            });
        } catch (e) {
            toast.error(e.message || "Load drivers failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyId) fetchDrivers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyId]);

    // debounce filters
    useEffect(() => {
        if (debounced.current) clearTimeout(debounced.current);
        debounced.current = setTimeout(() => {
            fetchDrivers(1);
        }, 350);
        return () => clearTimeout(debounced.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, status, minRating, sort]);

    return (
        <Container className="py-4">
            <FilterBar
                search={{
                    value: q,
                    onChange: setQ,
                    placeholder: "Search drivers by name…",
                }}
                selects={[
                    {
                        value: status,
                        onChange: setStatus,
                        style: { maxWidth: 180 },
                        options: [
                            { value: "", label: "All statuses" },
                            { value: "available", label: "Available" },
                            { value: "offline", label: "Offline" },
                        ],
                    },
                    {
                        value: minRating,
                        onChange: setMinRating,
                        style: { maxWidth: 160 },
                        options: [
                            { value: "", label: "Min rating" },
                            { value: "4.5", label: "≥ 4.5" },
                            { value: "4.0", label: "≥ 4.0" },
                            { value: "3.5", label: "≥ 3.5" },
                            { value: "3.0", label: "≥ 3.0" },
                        ],
                    },
                    {
                        value: sort,
                        onChange: setSort,
                        style: { maxWidth: 220 },
                        options: [
                            { value: "joinedAt:desc", label: "Joined ↓" },
                            { value: "joinedAt:asc", label: "Joined ↑" },
                            { value: "rating:desc", label: "Rating ↓" },
                            { value: "rating:asc", label: "Rating ↑" },
                            { value: "name:asc", label: "Name ↑" },
                            { value: "name:desc", label: "Name ↓" },
                        ],
                    },
                ]}
            />

            {loading ? (
                <div className="py-5 text-center">
                    <Spinner animation="border" />
                </div>
            ) : drivers.length === 0 ? (
                <div className="py-5 text-center text-muted">
                    No drivers found.
                </div>
            ) : (
                <>
                    <Row className="g-3">
                        {drivers.map((d) => (
                            <Col xs={12} sm={6} lg={4} key={d.userId}>
                                <DriverCard
                                    driver={d}
                                    showBio={true}
                                    showEmployment={true}
                                    employment={{
                                        baseSalaryCents: d.baseSalaryCents,
                                        joinedAt: d.joinedAt,
                                    }}
                                />
                            </Col>
                        ))}
                    </Row>

                    <div className="mt-3">
                        <PaginationBar
                            page={pageInfo.page}
                            size={pageInfo.size}
                            totalItems={pageInfo.totalItems}
                            totalPages={pageInfo.totalPages}
                            onPageChange={(p) => fetchDrivers(p, pageInfo.size)}
                            onSizeChange={(s) => fetchDrivers(1, s)}
                        />
                    </div>
                </>
            )}
        </Container>
    );
}
