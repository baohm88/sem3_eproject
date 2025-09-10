import React, { useMemo } from "react";
import { Pagination, Form } from "react-bootstrap";

/**
 * Build a compact page list with ellipses.
 * Returns an array of page numbers and the string "…" for gaps.
 *
 * Example:
 *   makePages(6, 20) -> [1, "…", 5, 6, 7, "…", 20]
 *
 * @param {number} current - Current (1-based) page
 * @param {number} total   - Total number of pages
 * @param {number} delta   - How many neighbors to show on each side
 */
function makePages(current, total, delta = 1) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current]);
  for (let d = 1; d <= delta; d++) {
    if (current - d > 1) pages.add(current - d);
    if (current + d < total) pages.add(current + d);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);

  // Insert ellipsis between non-consecutive pages
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    result.push(p);
    if (i < sorted.length - 1) {
      const next = sorted[i + 1];
      if (next - p > 1) result.push("…");
    }
  }
  return result;
}

/**
 * PaginationBar
 *
 * Controlled pagination component with an optional "per page" selector.
 *
 * Props:
 * - page            {number}  (1-based)
 * - size            {number}  current page size
 * - totalItems      {number}  total number of items across all pages
 * - totalPages      {number}  total number of pages
 * - onPageChange    {(newPage:number)=>void}
 * - onSizeChange?   {(newSize:number)=>void}
 * - sizeOptions?    {number[]} options for page size (default: [3, 6, 9])
 * - showSizeSelect? {boolean} show the size selector (default: true)
 * - className?      {string}
 *
 * Notes:
 * - This component is presentational and fully controlled by parent state.
 * - `page` is 1-based to match most backend pagination APIs.
 */
export default function PaginationBar({
  page,
  size,
  totalItems,
  totalPages,
  onPageChange,
  onSizeChange,
  sizeOptions = [3, 6, 9],
  showSizeSelect = true,
  className = "",
}) {
  // Pre-compute page list with ellipses whenever page/totalPages change
  const pages = useMemo(() => makePages(page, totalPages, 1), [page, totalPages]);

  // Human-friendly "showing X–Y of Z"
  const from = totalItems === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, totalItems);

  // Safe page navigation helper
  const goto = (p) => {
    if (!onPageChange) return;
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
  };

  return (
    <div className={`d-flex flex-wrap align-items-center gap-3 ${className}`} aria-label="Pagination toolbar">
      {/* Range summary */}
      <div className="text-muted small">
        Showing <strong>{from}</strong>–<strong>{to}</strong> of{" "}
        <strong>{totalItems}</strong>
      </div>

      {/* Optional page-size selector */}
      {showSizeSelect && onSizeChange && (
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">Per page</span>
          <Form.Select
            size="sm"
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            style={{ width: 90 }}
            aria-label="Items per page"
          >
            {sizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Form.Select>
        </div>
      )}

      {/* Page controls */}
      <Pagination className="mb-0 ms-auto" aria-label="Pagination">
        <Pagination.First disabled={page <= 1} onClick={() => goto(1)} />
        <Pagination.Prev disabled={page <= 1} onClick={() => goto(page - 1)} />

        {pages.map((p, idx) =>
          p === "…" ? (
            <Pagination.Ellipsis key={`el-${idx}`} disabled />
          ) : (
            <Pagination.Item key={p} active={p === page} onClick={() => goto(p)}>
              {p}
            </Pagination.Item>
          )
        )}

        <Pagination.Next disabled={page >= totalPages} onClick={() => goto(page + 1)} />
        <Pagination.Last disabled={page >= totalPages} onClick={() => goto(totalPages)} />
      </Pagination>
    </div>
  );
}
