// src/components/company/CompanyCardSkeleton.jsx
import { Card, Placeholder } from "react-bootstrap";

/**
 * CompanyCardSkeleton
 * Lightweight loading skeleton that mirrors the layout of CompanyCard.
 *
 * Props:
 * - imgHeight?: number — matches the image height used in CompanyCard (default 180)
 *
 * Notes:
 * - Use while fetching company data to avoid layout shift (CLS).
 * - Keep structure consistent with the final card for a smooth transition.
 */
export default function CompanyCardSkeleton({ imgHeight = 180 }) {
  return (
    <Card className="h-100 shadow-sm">
      {/* Image area skeleton — same height as the real image */}
      <div className="bg-light" style={{ height: imgHeight }} />

      <Card.Body>
        {/* Title skeleton */}
        <Placeholder as={Card.Title} animation="wave">
          <Placeholder xs={8} />
        </Placeholder>

        {/* Description skeleton — a few lines with decreasing widths */}
        <Placeholder as="p" animation="wave">
          <Placeholder xs={12} /> <Placeholder xs={10} /> <Placeholder xs={7} />
        </Placeholder>

        {/* Badge / action area skeleton */}
        <div className="d-flex gap-2">
          <Placeholder.Button variant="primary" xs={3} style={{ height: 24 }} />
          <Placeholder.Button variant="secondary" xs={3} style={{ height: 24 }} />
        </div>
      </Card.Body>
    </Card>
  );
}
