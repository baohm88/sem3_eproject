import { useEffect, useState } from "react";
import { Card, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

const FALLBACK_AVATAR =
    "https://dummyimage.com/300x300/e9ecef/6c757d.jpg&text=No+Avatar";

function safeSkills(skillsStr) {
    if (!skillsStr) return [];
    try {
        const arr = JSON.parse(skillsStr);
        return Array.isArray(arr) ? arr.filter(Boolean) : [];
    } catch {
        return String(skillsStr)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
}

function Stars({ value = 0, size = 16 }) {
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

function centsToVnd(cents) {
    const n = Number(cents || 0);
    return n.toLocaleString("vi-VN");
}

export default function DriverCard({
    driver,
    onClick,
    onInvite,
    isInvited,
    onRecall,
    className = "",
    showBio = true,
    imgSize = 56,
    showEmployment = false,
    employment, // { baseSalaryCents?: number, joinedAt?: string },
    footer,
}) {
    // Ảnh
    const preferred = driver?.imgUrl && String(driver.imgUrl).trim().length > 0 ? driver.imgUrl : FALLBACK_AVATAR;
    const isAvailable = driver?.isAvailable;
    const isHired = driver?.isHired;

    const [imgSrc, setImgSrc] = useState(preferred);

    useEffect(() => {
        setImgSrc(preferred);
    }, [preferred]);

    const skills = safeSkills(driver?.skills);

    // Employment info: ưu tiên prop employment, fallback lấy từ driver nếu có
    const baseSalaryCents =
        employment?.baseSalaryCents ??
        (typeof driver?.baseSalaryCents !== "undefined"
            ? driver.baseSalaryCents
            : undefined);
    const joinedAt =
        employment?.joinedAt ??
        (typeof driver?.joinedAt !== "undefined" ? driver.joinedAt : undefined);

    return (
        <Card
            className={`driver-card hover-lift h-100 shadow-sm ${className}`}
            style={{ cursor: onClick ? "pointer" : "default" }}
            onClick={() => onClick && onClick(driver)}
        >
            <Card.Body className="d-flex align-items-start gap-3" style={{ overflow: "hidden" }} >
                <Link
                    className="text-decoration-none"
                    to={`/drivers/${driver?.userId}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={imgSrc}
                        alt={driver?.fullName || "Driver"}
                        width={imgSize}
                        height={imgSize}
                        onError={() => {
                            if (imgSrc !== FALLBACK_AVATAR) 
                            setImgSrc(FALLBACK_AVATAR);
                        }}
                        style={{ objectFit: "cover", borderRadius: 12, flexShrink: 0 }}
                    />
                </Link>

                <div className="d-flex flex-column">
                    <div className="flex-grow-1 w-100" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-start gap-2 flex-wrap">
                            <div className="flex-grow-1" style={{ minWidth: 0 }} >
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <Card.Title className="mb-0 text-truncate" title={driver?.fullName}>
                                        <Link className="text-decoration-none" 
                                          to={`/drivers/${driver?.userId}`}
                                          onClick={(e) => e.stopPropagation()} 
                                        >
                                            {driver?.fullName || "Unnamed Driver"}
                                        </Link>
                                    </Card.Title>

                                    {isAvailable ? (<Badge bg="info">Available</Badge>) : (<Badge bg="secondary">Offline</Badge>)}
                                    {isInvited && ( <span className="badge bg-info-subtle text-info-emphasis"> Invited </span>)}
                                    {isHired && (<Badge bg="dark">Hired</Badge>)}

                                    {/* NEW: Employment badges */}
                                    {showEmployment &&
                                        (joinedAt ||
                                            baseSalaryCents != null) && (
                                            <>
                                                {joinedAt && (
                                                    <Badge
                                                        bg="light"
                                                        text="dark"
                                                    >
                                                        since{" "}
                                                        {new Date(
                                                            joinedAt
                                                        ).toLocaleDateString()}
                                                    </Badge>
                                                )}
                                                {baseSalaryCents != null && (
                                                    <Badge bg="primary">
                                                        salary{" "}
                                                        {centsToVnd(
                                                            baseSalaryCents
                                                        )}
                                                        ₫/mo
                                                    </Badge>
                                                )}
                                            </>
                                        )}
                                </div>

                                <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mt-1">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip> {Number( driver?.rating ?? 0 ).toFixed(1)}{" "} / 5.0 </Tooltip>
                                        }
                                    >
                                        <span onClick={(e) => e.stopPropagation()} >
                                            <Stars value={driver?.rating ?? 0} />
                                        </span>
                                    </OverlayTrigger>

                                    {driver?.location && (
                                        <span className="d-inline-flex align-items-center">
                                            <i className="bi bi-geo-alt me-1" />
                                            <span className="text-truncate">
                                                {driver.location}
                                            </span>
                                        </span>
                                    )}

                                    {driver?.phone && (
                                        <span className="d-inline-flex align-items-center">
                                            <i className="bi bi-telephone me-1" />
                                            <span className="text-truncate">
                                                {driver.phone}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto d-flex justify-content-end">
                                {isInvited ? (
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRecall?.(driver);
                                        }}
                                    >
                                        Recall Invitation
                                    </button>
                                ) : (
                                    !!onInvite && (
                                        <button
                                            className={`btn ${isAvailable ? "btn-primary": "btn-secondary"} btn-sm`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onInvite(driver);
                                            }}
                                            disabled={ !isAvailable || isHired}
                                        >
                                            Invite
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {showBio && (
                            <Card.Text className="text-muted mt-2 mb-2">
                                {driver?.bio || (
                                    <span className="fst-italic">No bio</span>
                                )}
                            </Card.Text>
                        )}

                        {skills.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                                {skills.slice(0, 8).map((sk) => (
                                    <span
                                        key={sk}
                                        className="badge rounded-pill text-bg-light border"
                                    >
                                        {sk}
                                    </span>
                                ))}
                                {skills.length > 8 && (
                                    <span className="badge rounded-pill text-bg-light border">
                                        +{skills.length - 8}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="text-muted fst-italic">No skills</div>
                        )}
                    </div>
                    {footer && <div className="mt-2">{footer}</div>}
                </div>
            </Card.Body>
        </Card>
    );
}
