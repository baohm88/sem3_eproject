import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Col, Row, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { getCompanyPublicProfile } from "../../api/companies";

const FALLBACK_LOGO =
    "https://dummyimage.com/300x300/e9ecef/6c757d.jpg&text=No+Logo";

export default function CompanyPublicProfilePage() {
    const { companyId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getCompanyPublicProfile(companyId, {
                    page: 1,
                    size: 10,
                    sort: "updatedAt:desc",
                });
                setData(res);
            } catch (e) {
                toast.error(e?.message || "Cannot load company profile");
            } finally {
                setLoading(false);
            }
        })();
    }, [companyId]);

    // guard: nếu thiếu param trong URL
    if (!companyId) {
        return (
            <div className="py-5 text-center text-danger">
                Invalid URL: missing companyId
            </div>
        );
    }

    if (loading) {
        return (
            <div className="py-5 text-center">
                <Spinner animation="border" />
            </div>
        );
    }

    if (!data?.company) {
        return (
            <div className="py-5 text-center text-muted">
                Company not found.
            </div>
        );
    }

    const company = data.company;
    const logoSrc =
        company.imgUrl && company.imgUrl.trim()
            ? company.imgUrl
            : FALLBACK_LOGO;

    return (
        <div className="py-3">
            <Row className="g-3">
                {/* Left column: logo + meta */}
                <Col xs={12} md={4} lg={3}>
                    <Card className="shadow-sm">
                        <Card.Body className="text-center">
                            <img
                                src={logoSrc}
                                alt={company.name}
                                onError={(e) =>
                                    (e.currentTarget.src = FALLBACK_LOGO)
                                }
                                style={{
                                    width: 128,
                                    height: 128,
                                    objectFit: "cover",
                                    borderRadius: 16,
                                }}
                            />
                            <h5 className="mt-3 mb-1">{company.name}</h5>
                            <div className="text-muted small">
                                {company.description || "—"}
                            </div>
                            <div className="mt-2">
                                <Badge bg="info">{company.membership}</Badge>
                                {company.isActive ? (
                                    <Badge bg="success" className="ms-2">
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge bg="secondary" className="ms-2">
                                        Inactive
                                    </Badge>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right column: services */}
                <Col xs={12} md={8} lg={9}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="h6">Services</Card.Title>
                            {data.services?.length ? (
                                <Row className="g-3">
                                    {data.services.map((svc) => (
                                        <Col xs={12} md={6} key={svc.id}>
                                            <Card className="h-100 shadow-sm">
                                                <Card.Body>
                                                    <Card.Title>
                                                        {svc.title}
                                                    </Card.Title>
                                                    <Card.Text className="text-muted">
                                                        {svc.description || "—"}
                                                    </Card.Text>
                                                    <div className="fw-bold text-primary">
                                                        {svc.priceCents?.toLocaleString(
                                                            "vi-VN"
                                                        )}{" "}
                                                        ₫
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <div className="text-muted">
                                    No active services
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
