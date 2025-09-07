// src/components/company/CompanyIdentity.jsx
import { Card, Button, Badge, Image } from "react-bootstrap";

export default function CompanyIdentity({
  company,
  placeholderLogo,
  onEdit,
  dashboardPath,
}) {
  const membershipBadge = (m, expires) => (
    <Badge
      bg={m === "Pro" ? "success" : m === "Business" ? "primary" : "secondary"}
    >
      {m || "Free"}
      {expires ? ` · exp ${new Date(expires).toLocaleDateString()}` : ""}
    </Badge>
  );

  return (
    <Card className="shadow-sm">
      <Card.Body className="d-flex gap-3 align-items-center">
        <Image
          src={company?.imgUrl || placeholderLogo}
          roundedCircle
          style={{ width: 96, height: 96, objectFit: "cover" }}
          alt="Logo"
        />
        <div className="flex-grow-1">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <h4 className="mb-0">{company?.name || "Unnamed Company"}</h4>
            {membershipBadge(company?.membership, company?.membershipExpiresAt)}
            {company?.isActive ? (
              <Badge bg="primary" className="border">Active</Badge>
            ) : (
              <Badge bg="secondary">Inactive</Badge>
            )}
          </div>

          {company?.description ? (
            <div className="text-muted mt-2">{company.description}</div>
          ) : (
            <div className="text-muted mt-2 fst-italic">No description yet.</div>
          )}

          <div className="mt-3 d-flex gap-2">
            <Button size="sm" variant="primary" onClick={onEdit}>
              Edit profile
            </Button>
            <Button size="sm" variant="outline-secondary" href={dashboardPath}>
              Go to dashboard
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
