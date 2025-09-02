import { Badge, Button, Card, Collapse } from "react-bootstrap";
import CompanyServicesList from "./CompanyServicesList";

const PLACEHOLDER_LOGO =
    "https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=600&auto=format&fit=crop&q=60";

/**
 * Card công ty dành cho trang DriverJobs / DriverInvites
 *
 * Props:
 * - company
 * - isExpanded: boolean
 * - onToggleServices: (companyId)=>void
 * - services: Service[]
 * - loadingServices: boolean
 *
 * - onApply: (company)=>void
 * - onRecall: (company)=>void
 * - isApplied?: boolean
 *
 * - onAccept: (invite)=>void
 * - onReject: (invite)=>void
 * - inviteStatus?: string
 * - disabledActions?: boolean
 */
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
}) {
    const membershipBadge = (m) => (
        <Badge
            bg={
                m === "Premium"
                    ? "success"
                    : m === "Basic"
                    ? "primary"
                    : "secondary"
            }
        >
            {m || "Free"}
        </Badge>
    );

    return (
        <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
                {/* Header */}
                <div className="d-flex align-items-center gap-3">
                    <img
                        src={company.imgUrl || PLACEHOLDER_LOGO}
                        alt={company.name}
                        style={{
                            width: 56,
                            height: 56,
                            objectFit: "cover",
                            borderRadius: 12,
                        }}
                    />
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <Card.Title className="mb-0">
                                {company.name || "Untitled"}
                            </Card.Title>
                            {membershipBadge(company.membership)}
                            {isApplied && (
                                <Badge bg="warning" text="dark">
                                    Applied
                                </Badge>
                            )}
                            {inviteStatus && (
                                <Badge bg="info" text="dark">
                                    {inviteStatus}
                                </Badge>
                            )}
                        </div>
                        <div className="small text-muted">
                            Rating {company.rating?.toFixed?.(1) ?? "0.0"}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <Card.Text
                    className="text-muted mt-2"
                    style={{ minHeight: 44 }}
                >
                    {company.description || (
                        <span className="fst-italic">No description</span>
                    )}
                </Card.Text>

                {/* Invite details */}
                {invite && (
                    <div className="my-2 small">
                        <div>
                            <strong>Base salary:</strong>{" "}
                            {invite.baseSalaryCents}
                        </div>
                        <div>
                            <strong>Expires at:</strong> {invite.expiresAt}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-auto d-flex gap-2 flex-wrap">
                    {isExpanded ?? (
                        <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => onToggleServices(company.id)}
                        >
                            {isExpanded ? "Hide services" : "View services"}
                        </Button>
                    )}

                    {onAccept || onReject ? (
                        <>
                            <Button
                                size="sm"
                                variant="primary"
                                disabled={disabledActions}
                                onClick={() => onAccept?.(company)}
                            >
                                Accept
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-danger"
                                disabled={disabledActions}
                                onClick={() => onReject?.(company)}
                            >
                                Reject
                            </Button>
                        </>
                    ) : disabledActions ? (
                        <Button
                            size="sm"
                            disabled
                            variant={disabledActions ? "secondary" : "primary"}
                            title="Bạn đã là tài xế của một công ty"
                        >
                            Apply
                        </Button>
                    ) : isApplied ? (
                        <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => onRecall(company)}
                        >
                            Recall Application
                        </Button>
                    ) : (
                        <Button size="sm" onClick={() => onApply(company)}>
                            Apply
                        </Button>
                    )}
                </div>

                {/* Services list */}
                <Collapse in={isExpanded}>
                    <div>
                        <hr />
                        <CompanyServicesList
                            services={services}
                            loading={loadingServices}
                        />
                    </div>
                </Collapse>
            </Card.Body>
        </Card>
    );
}
