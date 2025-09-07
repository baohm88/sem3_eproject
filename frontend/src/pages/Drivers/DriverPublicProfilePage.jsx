// src/pages/Drivers/DriverPublicProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Col, Row, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { getDriverPublicProfile } from "../../api/drivers";
import { jsonOrCsvToArray } from "../../utils/skills.ts";

const FALLBACK_AVATAR =
    "https://dummyimage.com/300x300/e9ecef/6c757d.jpg&text=No+Avatar";

function Stars({ value = 0, size = 18 }) {
    const v = Math.max(0, Math.min(5, Number(value) || 0));
    const full = Math.floor(v);
    const half = v - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
        <span className="d-inline-flex align-items-center gap-1">
            {Array.from({ length: full }).map((_, i) => (
                <i
                    key={`f${i}`}
                    className="bi bi-star-fill text-warning"
                    style={{ fontSize: size }}
                />
            ))}
            {half === 1 && (
                <i
                    className="bi bi-star-half text-warning"
                    style={{ fontSize: size }}
                />
            )}
            {Array.from({ length: empty }).map((_, i) => (
                <i
                    key={`e${i}`}
                    className="bi bi-star"
                    style={{ fontSize: size }}
                />
            ))}
        </span>
    );
}

export default function DriverPublicProfilePage() {
    const { driverId } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const driver = data?.driver ?? null;
    const skills = useMemo(
        () => jsonOrCsvToArray(driver?.skills),
        [driver?.skills]
    );

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getDriverPublicProfile(driverId);
                setData(res);
            } catch (e) {
                toast.error(e?.message || "Cannot load driver profile");
            } finally {
                setLoading(false);
            }
        })();
    }, [driverId]);

    if (loading) {
        return (
            <div className="py-5 text-center">
                <Spinner animation="border" />
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="py-5 text-center text-muted">Driver not found.</div>
        );
    }

    const imgSrc =
        driver.imgUrl && driver.imgUrl.trim() ? driver.imgUrl : FALLBACK_AVATAR;

    return (
        <div className="py-3">
            <Row className="g-3">
                {/* Left: Avatar + meta */}
                <Col xs={12} md={4} lg={3}>
                    <Card className="shadow-sm">
                        <Card.Body className="text-center">
                            <img
                                src={imgSrc}
                                alt={driver.fullName}
                                onError={(e) =>
                                    (e.currentTarget.src = FALLBACK_AVATAR)
                                }
                                style={{
                                    width: 128,
                                    height: 128,
                                    objectFit: "cover",
                                    borderRadius: 16,
                                }}
                            />
                            <h5 className="mt-3 mb-1">{driver.fullName}</h5>
                            <div className="text-muted small">
                                {driver.location || "—"}
                            </div>
                            <div className="mt-2">
                                <Stars
                                    value={data?.rating ?? driver.rating ?? 0}
                                />
                            </div>
                            <div className="mt-2">
                                {driver.isAvailable ? (
                                    <Badge bg="success">Available</Badge>
                                ) : (
                                    <Badge bg="secondary">Offline</Badge>
                                )}
                                {driver.isHired && (
                                    <Badge bg="info" className="ms-2">
                                        Hired
                                    </Badge>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Hired company */}
                    <Card className="shadow-sm mt-3">
                        <Card.Body>
                            <Card.Title className="h6 mb-3">
                                Hired Company
                            </Card.Title>
                            {data?.hiredCompany ? (
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={
                                            data.hiredCompany.imgUrl ||
                                            "https://dummyimage.com/48x48/e9ecef/6c757d.jpg&text=Co"
                                        }
                                        alt={data.hiredCompany.name}
                                        width={40}
                                        height={40}
                                        style={{
                                            objectFit: "cover",
                                            borderRadius: 8,
                                        }}
                                    />
                                    <div>
                                        <div className="fw-semibold">
                                            <Link
                                                to={`/companies/${data.hiredCompany.id}`}
                                            >
                                                {data.hiredCompany.name}
                                            </Link>
                                        </div>
                                        <div className="text-muted small">
                                            Plan: {data.hiredCompany.membership}{" "}
                                            • Rating:{" "}
                                            {Number(
                                                data.hiredCompany.rating ?? 0
                                            ).toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted">—</div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right: About / Skills / Employment / Reviews */}
                <Col xs={12} md={8} lg={9}>
                    <Row className="g-3">
                        {/* About */}
                        <Col xs={12}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="h6">
                                        About
                                    </Card.Title>
                                    <div className="text-muted">
                                        {driver.bio || "—"}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Skills */}
                        <Col xs={12}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="h6">
                                        Skills
                                    </Card.Title>
                                    {skills.length ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {skills.map((s) => (
                                                <span
                                                    key={s}
                                                    className="badge rounded-pill text-bg-light border"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-muted">—</div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Employment History */}
                        <Col xs={12}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="h6">
                                        Employment History
                                    </Card.Title>
                                    {data?.employmentHistory?.length ? (
                                        <div className="d-flex flex-column gap-3">
                                            {data.employmentHistory.map((e) => (
                                                <div
                                                    key={`${e.companyId}-${e.since}`}
                                                    className="d-flex align-items-center gap-3"
                                                >
                                                    <img
                                                        src={
                                                            e.companyImgUrl ||
                                                            "https://dummyimage.com/40x40/e9ecef/6c757d.jpg&text=Co"
                                                        }
                                                        alt={e.companyName}
                                                        width={32}
                                                        height={32}
                                                        style={{
                                                            objectFit: "cover",
                                                            borderRadius: 6,
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="fw-semibold">
                                                            <Link
                                                                to={`/companies/${e.companyId}`}
                                                            >
                                                                {e.companyName}
                                                            </Link>
                                                        </div>
                                                        <div className="text-muted small">
                                                            Since{" "}
                                                            {new Date(
                                                                e.since
                                                            ).toLocaleDateString()}{" "}
                                                            • Base salary:{" "}
                                                            {e.baseSalaryCents}₫
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-muted">—</div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Ratings & Comments (placeholder) */}
                        <Col xs={12}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <Card.Title className="h6">
                                        Ratings & Comments
                                    </Card.Title>
                                    <div className="text-muted">—</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}
