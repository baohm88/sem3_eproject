import React, { useMemo } from "react";
import { Pagination, Form } from "react-bootstrap";

function makePages(current, total, delta = 1) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set([1, total, current]);
    for (let d = 1; d <= delta; d++) {
        if (current - d > 1) pages.add(current - d);
        if (current + d < total) pages.add(current + d);
    }
    const sorted = Array.from(pages).sort((a, b) => a - b);

    // chèn ellipsis
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
 * Props:
 * - page (number, 1-based)
 * - size (number)
 * - totalItems (number)
 * - totalPages (number)
 * - onPageChange(newPage: number)
 * - onSizeChange?(newSize: number)
 * - sizeOptions? number[] = [10, 20, 50]
 * - showSizeSelect? boolean = true
 * - className? string
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
    const pages = useMemo(
        () => makePages(page, totalPages, 1),
        [page, totalPages]
    );
    const from = totalItems === 0 ? 0 : (page - 1) * size + 1;
    const to = Math.min(page * size, totalItems);

    const goto = (p) => {
        if (!onPageChange) return;
        if (p < 1 || p > totalPages || p === page) return;
        onPageChange(p);
    };

    return (
        <div
            className={`d-flex flex-wrap align-items-center gap-3 ${className}`}
        >
            <div className="text-muted small">
                Showing <strong>{from}</strong>–<strong>{to}</strong> of{" "}
                <strong>{totalItems}</strong>
            </div>

            {showSizeSelect && onSizeChange && (
                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small">Per page</span>
                    <Form.Select
                        size="sm"
                        value={size}
                        onChange={(e) => onSizeChange(Number(e.target.value))}
                        style={{ width: 90 }}
                    >
                        {sizeOptions.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </Form.Select>
                </div>
            )}

            <Pagination className="mb-0 ms-auto">
                <Pagination.First
                    disabled={page <= 1}
                    onClick={() => goto(1)}
                />
                <Pagination.Prev
                    disabled={page <= 1}
                    onClick={() => goto(page - 1)}
                />

                {pages.map((p, idx) =>
                    p === "…" ? (
                        <Pagination.Ellipsis key={`el-${idx}`} disabled />
                    ) : (
                        <Pagination.Item
                            key={p}
                            active={p === page}
                            onClick={() => goto(p)}
                        >
                            {p}
                        </Pagination.Item>
                    )
                )}

                <Pagination.Next
                    disabled={page >= totalPages}
                    onClick={() => goto(page + 1)}
                />
                <Pagination.Last
                    disabled={page >= totalPages}
                    onClick={() => goto(totalPages)}
                />
            </Pagination>
        </div>
    );
}
