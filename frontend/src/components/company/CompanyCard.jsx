import { useState } from "react";
import { Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";

function truncate(text, n = 110) {
    if (!text) return "—";
    return text.length > n ? text.slice(0, n) + "…" : text;
}

const FALLBACK_IMG =
    "https://dummyimage.com/800x450/e9ecef/6c757d.jpg&text=No+Image";

function Stars({ value = 0, size = 16 }) {
    // value kỳ vọng 0..5 (có thể 0..5.0); nếu BE đang 0..10 thì chia 2 trước khi truyền vào
    const v = Math.max(0, Math.min(5, Number(value) || 0));
    const full = Math.floor(v);
    const half = v - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return (
        <div className="d-inline-flex align-items-center gap-1">
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
        </div>
    );
}

export default function CompanyCard({
    company,
    isFavorite = false,
    onToggleFavorite,
    onClick,
    className = "",
    showDescription = true,
    showStatusBadges = true,
    imgHeight = 180,
    // nếu BE rating 0..10 thì truyền rating/2 xuống đây
    rating = company?.rating ?? 0,
}) {
    const [imgSrc, setImgSrc] = useState(company?.imgUrl || FALLBACK_IMG);

    const handleCardClick = () => {
        if (onClick) onClick(company);
    };

    const handleFavClick = (e) => {
        e.stopPropagation();
        if (onToggleFavorite) onToggleFavorite(company);
    };

    return (
        <Card
            className={`company-card hover-lift h-100 shadow-sm position-relative ${className}`}
            style={{ cursor: onClick ? "pointer" : "default" }}
            onClick={handleCardClick}
        >
            {/* Favorite button */}
            {onToggleFavorite && (
                <Button
                    variant="light"
                    className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm z-3"
                    //        ↑↑↑ thêm z-3 để đảm bảo nằm trên ảnh
                    onClick={(e) => {
                        e.stopPropagation(); // chặn navigate card
                        if (onToggleFavorite) onToggleFavorite(company);
                    }}
                    aria-label={isFavorite ? "Unfavorite" : "Favorite"}
                >
                    <i
                        className={`bi ${
                            isFavorite
                                ? "bi-heart-fill text-danger"
                                : "bi-heart"
                        }`}
                    />
                </Button>
            )}

            <div className="overflow-hidden rounded-top">
                <Card.Img
                    variant="top"
                    src={imgSrc}
                    onError={() => setImgSrc(FALLBACK_IMG)}
                    alt={company?.name || "Company"}
                    style={{
                        height: imgHeight,
                        objectFit: "cover",
                        transition: "transform .35s ease",
                    }}
                    className="company-card__img"
                />
            </div>

            <Card.Body>
                <div className="d-flex justify-content-between align-items-start gap-2">
                    <Card.Title className="mb-2 flex-grow-1">
                        {company?.name || "Unnamed Company"}
                    </Card.Title>

                    {/* Rating sao + tooltip số */}
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip>{Number(rating).toFixed(1)} / 5.0</Tooltip>
                        }
                    >
                        <div
                            className="ms-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Stars value={rating} />
                        </div>
                    </OverlayTrigger>
                </div>

                {showDescription && (
                    <Card.Text className="text-muted" style={{ minHeight: 60 }}>
                        {truncate(company?.description)}
                    </Card.Text>
                )}

                {showStatusBadges && (
                    <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-primary">
                            {company?.membership || "Free"}
                        </span>
                        {company?.isActive ? (
                            <span className="badge bg-success">Active</span>
                        ) : (
                            <span className="badge bg-secondary">Inactive</span>
                        )}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}
