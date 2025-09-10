import { Card, Button, Badge, Image } from "react-bootstrap";

/**
 * CompanyIdentity
 * Compact header card showing company avatar/logo, name, membership, status,
 * short description, and quick actions.
 *
 * Props:
 * - company: {
 *     name?: string,
 *     imgUrl?: string,
 *     description?: string,
 *     membership?: "Free" | "Pro" | "Business",
 *     membershipExpiresAt?: string | Date,
 *     isActive?: boolean
 *   }
 * - placeholderLogo: fallback image URL when company.imgUrl is missing/broken
 * - onEdit: () => void — handler for "Edit profile" button
 * - dashboardPath: string — href for "Go to dashboard" button
 */
export default function CompanyIdentity({
  company,
  placeholderLogo,
  onEdit,
  dashboardPath,
}) {
  /**
   * Renders a membership badge with an optional expiration date.
   * Color mapping:
   * - Pro -> success
   * - Business -> primary
   * - default/unknown -> secondary ("Free")
   */
  const membershipBadge = (m, expires) => (
    <Badge
      bg={m === "Pro" ? "success" : m === "Business" ? "primary" : "secondary"}
    >
      {m || "Free"}
      {/* Append short local date when available */}
      {expires ? ` · exp ${new Date(expires).toLocaleDateString()}` : ""}
    </Badge>
  );

  return (
    <Card className="shadow-sm">
      <Card.Body className="d-flex gap-3 align-items-center">
        {/* Avatar/logo — circles to 96x96, cover to avoid distortion */}
        <Image
          src={company?.imgUrl || placeholderLogo}
          roundedCircle
          style={{ width: 96, height: 96, objectFit: "cover" }}
          alt="Company logo"
        />

        <div className="flex-grow-1">
          {/* Title row: name + membership + active status */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            <h4 className="mb-0">{company?.name || "Unnamed Company"}</h4>

            {membershipBadge(company?.membership, company?.membershipExpiresAt)}

            {company?.isActive ? (
              <Badge bg="primary" className="border">Active</Badge>
            ) : (
              <Badge bg="secondary">Inactive</Badge>
            )}
          </div>

          {/* Short description or a subtle placeholder */}
          {company?.description ? (
            <div className="text-muted mt-2">{company.description}</div>
          ) : (
            <div className="text-muted mt-2 fst-italic">No description yet.</div>
          )}

          {/* Quick actions: edit profile and open dashboard */}
          <div className="mt-3 d-flex gap-2">
            {/* Ensure `onEdit` is provided by parent */}
            <Button size="sm" variant="primary" onClick={onEdit}>
              Edit profile
            </Button>

            {/* `dashboardPath` should be a valid route/URL */}
            <Button size="sm" variant="outline-secondary" href={dashboardPath}>
              Go to dashboard
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
