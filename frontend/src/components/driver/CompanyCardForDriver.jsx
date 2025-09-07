import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Collapse,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import CompanyServicesList from "./CompanyServicesList";

const FALLBACK_LOGO =
  "https://dummyimage.com/300x300/e9ecef/6c757d.jpg&text=No+Logo";

// ⭐ giống DriverCard
function Stars({ value = 0, size = 16 }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="d-inline-flex align-items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <i key={`f${i}`} className="bi bi-star-fill text-warning" style={{ fontSize: size }} />
      ))}
      {half === 1 && (
        <i className="bi bi-star-half text-warning" style={{ fontSize: size }} />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <i key={`e${i}`} className="bi bi-star" style={{ fontSize: size }} />
      ))}
    </span>
  );
}

function centsToVnd(cents) {
  return Number(cents || 0).toLocaleString("vi-VN");
}

export default function CompanyCardForDriver({
  invite,
  company,
  isExpanded = false,
  onToggleServices,
  services,
  loadingServices,

  onApply,
  onRecall,
  isApplied = false,

  onAccept,
  onReject,
  inviteStatus,
  disabledActions = false,
  className = "",
  imgSize = 56,
}) {
  // Ảnh
  const preferred =
    company?.imgUrl && String(company.imgUrl).trim().length > 0
      ? company.imgUrl
      : FALLBACK_LOGO;
  const [imgSrc, setImgSrc] = useState(preferred);
  useEffect(() => { setImgSrc(preferred); }, [preferred]);

  // Badge membership
  const membershipBadge = (m) => (
    <Badge bg={m === "Premium" ? "success" : m === "Basic" ? "primary" : "secondary"}>
      {m || "Free"}
    </Badge>
  );

  // ✅ Optimistic UI cho Apply/Recall (không cần refresh)
  const [appliedLocal, setAppliedLocal] = useState(!!isApplied);
  useEffect(() => { setAppliedLocal(!!isApplied); }, [isApplied]);
  const applied = appliedLocal; // trạng thái hiệu lực hiển thị

  const handleApplyClick = async (e) => {
    e.stopPropagation();
    // optimistic on
    setAppliedLocal(true);
    try {
      const ret = onApply?.(company);
      // nếu parent trả Promise, chờ lỗi để rollback
      if (ret && typeof ret.then === "function") {
        await ret;
      }
    } catch (err) {
      // rollback khi lỗi
      setAppliedLocal(false);
    }
  };

  const handleRecallClick = async (e) => {
    e.stopPropagation();
    // optimistic off
    setAppliedLocal(false);
    try {
      const ret = onRecall?.(company);
      if (ret && typeof ret.then === "function") {
        await ret;
      }
    } catch (err) {
      // rollback khi lỗi
      setAppliedLocal(true);
    }
  };

  return (
    <Card className={`driver-card hover-lift h-100 shadow-sm ${className}`}>
      <Card.Body className="d-flex align-items-start gap-3" style={{ overflow: "hidden" }}>
        {/* AVATAR */}
        <Link
          className="text-decoration-none"
          to={`/listings/${company?.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imgSrc}
            alt={company?.name || "Company"}
            width={imgSize}
            height={imgSize}
            onError={() => { if (imgSrc !== FALLBACK_LOGO) setImgSrc(FALLBACK_LOGO); }}
            style={{ objectFit: "cover", borderRadius: 12, flexShrink: 0 }}
          />
        </Link>

        {/* CONTENT */}
        <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
          <div className="flex-grow-1 w-100" style={{ minWidth: 0 }}>
            <div className="d-flex align-items-start gap-2 flex-wrap">
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                {/* Title + badges */}
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <Card.Title className="mb-0 text-truncate" title={company?.name}>
                    <Link
                      className="text-decoration-none"
                      to={`/listings/${company?.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {company?.name || "Untitled Company"}
                    </Link>
                  </Card.Title>

                  {membershipBadge(company?.membership)}
                  {applied && <span className="badge bg-warning text-dark">Applied</span>}
                  {inviteStatus && (
                    <span className="badge bg-info-subtle text-info-emphasis">{inviteStatus}</span>
                  )}
                  {company?.isActive ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Inactive</Badge>}
                </div>

                {/* Meta: rating */}
                <div className="d-flex flex-wrap align-items-center gap-2 text-muted small mt-1">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>{Number(company?.rating ?? 0).toFixed(1)} / 5.0</Tooltip>
                    }
                  >
                    <span onClick={(e) => e.stopPropagation()}>
                      <Stars value={company?.rating ?? 0} />
                    </span>
                  </OverlayTrigger>
                </div>
              </div>

              {/* Accept/Reject (nếu có invite flow) */}
              {(onAccept || onReject) && (
                <div className="ms-auto d-flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={disabledActions}
                    onClick={(e) => { e.stopPropagation(); onAccept?.(company); }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    disabled={disabledActions}
                    onClick={(e) => { e.stopPropagation(); onReject?.(company); }}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            <Card.Text className="text-muted mt-2 mb-2">
              {company?.description || <span className="fst-italic">No description</span>}
            </Card.Text>

            {/* 🔹 Invite badges: base salary / expires at — đặt NGAY TRÊN FOOTER */}
            {invite && (invite.baseSalaryCents != null || invite.expiresAt) && (
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                {invite.expiresAt && (
                  <Badge bg="light" text="dark">
                    until {new Date(invite.expiresAt).toLocaleDateString()}
                  </Badge>
                )}
                {invite.baseSalaryCents != null && (
                  <Badge bg="primary">
                    base {centsToVnd(invite.baseSalaryCents)} ₫/mo
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* FOOTER: trái = View services, phải = CTA Apply/Recall */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-1">
            {typeof onToggleServices === "function" && (
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={(e) => { e.stopPropagation(); onToggleServices(company.id); }}
              >
                {isExpanded ? "Hide services" : "View services"}
              </Button>
            )}

            <div className="ms-auto d-flex gap-2">
              {disabledActions ? (
                <Button
                  size="sm"
                  disabled
                  variant="secondary"
                  title="Bạn đã là tài xế của một công ty"
                  onClick={(e) => e.stopPropagation()}
                >
                  Apply to Company
                </Button>
              ) : applied ? (
                <Button size="sm" variant="outline-danger" onClick={handleRecallClick}>
                  Recall Application
                </Button>
              ) : (
                <Button size="sm" variant="primary" onClick={handleApplyClick}>
                  Apply to Company
                </Button>
              )}
            </div>
          </div>

          {/* Services list */}
          <Collapse in={isExpanded}>
            <div>
              <hr />
              <CompanyServicesList services={services} loading={loadingServices} />
            </div>
          </Collapse>
        </div>
      </Card.Body>
    </Card>
  );
}
