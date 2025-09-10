// src/components/common/FilterBar.jsx
import { Card, Form, InputGroup } from "react-bootstrap";

/**
 * Generic, reusable filter bar for many pages (companies, services, drivers, ...).
 *
 * Props:
 * - search?: {
 *     value: string;
 *     onChange: (v: string) => void;
 *     placeholder?: string;
 *   }
 * - selects?: Array<{
 *     value: string;
 *     onChange: (v: string) => void;
 *     options: Array<{ value?: string; label: string }>;
 *     style?: React.CSSProperties;
 *     ariaLabel?: string;
 *   }>
 * - className?: string
 *
 * Notes:
 * - The search input is controlled externally via `search.value` / `search.onChange`.
 * - Each select is fully controlled by its own `value` / `onChange`.
 * - Keep it presentation-only; no internal state so it's easy to reuse.
 */
export default function FilterBar({ search, selects = [], className = "" }) {
  return (
    <Card className={`border-0 shadow-sm mb-3 ${className}`}>
      <Card.Body className="d-flex flex-column flex-md-row gap-2">
        {/* Search box (optional) */}
        {search && (
          <InputGroup className="flex-grow-1">
            <InputGroup.Text>
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              placeholder={search.placeholder || "Search..."}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              aria-label={search.placeholder || "Search"}
            />
          </InputGroup>
        )}

        {/* One or more select dropdowns (optional) */}
        {selects.map((s, idx) => (
          <Form.Select
            key={idx}
            value={s.value}
            onChange={(e) => s.onChange(e.target.value)}
            style={s.style}
            aria-label={s.ariaLabel || `filter-${idx}`}
          >
            {s.options.map((opt) => (
              <option key={String(opt.value ?? "")} value={opt.value ?? ""}>
                {opt.label}
              </option>
            ))}
          </Form.Select>
        ))}
      </Card.Body>
    </Card>
  );
}
