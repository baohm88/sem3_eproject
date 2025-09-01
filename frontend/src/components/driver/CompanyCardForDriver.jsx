import { Badge, Button, Card, Collapse } from "react-bootstrap";
import CompanyServicesList from "./CompanyServicesList";

const PLACEHOLDER_LOGO =
    "https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=600&auto=format&fit=crop&q=60";

/**
 * Card công ty dành cho trang DriverJobs
 *
 * Props:
 * - company
 * - isExpanded: boolean
 * - onToggleServices: (companyId)=>void
 * - services: Service[]
 * - loadingServices: boolean
 * - onApply: (company)=>void
 * - isApplied?: boolean
 */
export default function CompanyCardForDriver({
    company,
    isExpanded,
    onToggleServices,
    services,
    loadingServices,
    onApply,
    onRecall,
    isApplied = false,
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
                        </div>
                        <div className="small text-muted">
                            Rating {company.rating?.toFixed?.(1) ?? "0.0"}
                        </div>
                    </div>
                </div>

                <Card.Text
                    className="text-muted mt-2"
                    style={{ minHeight: 44 }}
                >
                    {company.description || (
                        <span className="fst-italic">No description</span>
                    )}
                </Card.Text>

                <div className="mt-auto d-flex gap-2">
                    <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => onToggleServices(company.id)}
                    >
                        {isExpanded ? "Hide services" : "View services"}
                    </Button>
                    {/* <Button
            size="sm"
            onClick={() => onApply(company)}
            disabled={isApplied}
            variant={isApplied ? "outline-secondary" : "primary"}
          >
            {isApplied ? "Applied" : "Apply"}
          </Button> */}
                    {isApplied ? (
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
