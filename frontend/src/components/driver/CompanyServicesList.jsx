import { Spinner } from "react-bootstrap";

/** Helper: format cents -> VND string using vi-VN locale (no currency symbol) */
function centsToVnd(cents) {
  return (cents / 100).toLocaleString("vi-VN");
}

/**
 * Render the list of services for a company.
 *
 * Props:
 * - services: Array<{ id, title, priceCents, ... }>
 * - loading: boolean
 *
 * Notes:
 * - Shows a compact loading state and an empty placeholder.
 * - Ensure the file name matches your imports (commonly `CompanyServicesList`).
 */
export default function CompanyServicesList({ services, loading }) {
  if (loading) {
    return (
      <div className="py-2 text-center">
        <Spinner size="sm" animation="border" />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return <div className="text-muted fst-italic">No active services.</div>;
  }

  return (
    <ul className="list-unstyled mb-0">
      {services.map((s) => (
        <li key={s.id} className="d-flex justify-content-between py-1">
          {/* Title is truncated to keep the row single-line */}
          <span className="text-truncate me-2">{s.title}</span>
          <span className="fw-semibold">{centsToVnd(s.priceCents)} ₫</span>
        </li>
      ))}
    </ul>
  );
}
