import { ListGroup, Badge } from "react-bootstrap";

/**
 * TransactionList
 * Renders a (flush) list of transactions with amount, status/type badges, and optional meta info.
 *
 * Props:
 * - transactions: Array of transaction objects.
 * - emptyText: Placeholder text when there is no data.
 * - limit: Optional max number of items to render.
 * - formatAmount: Optional formatter for amount in cents -> display string.
 * - onItemClick: Optional handler; when provided, items become clickable.
 * - perspectiveWalletId: Wallet ID used to sign (+/-) and color the amount from a specific wallet's point of view.
 */
export default function TransactionList({
  transactions = [],
  emptyText = "No transactions",
  limit,
  formatAmount,
  onItemClick,
  perspectiveWalletId,
}) {
  // Normalize to an array to avoid runtime errors
  const items = Array.isArray(transactions) ? transactions : [];

  // Default amount formatter (VND, no decimals)
  const baseFormatAmount =
    formatAmount ||
    ((cents) =>
      (Math.round(cents) / 100).toLocaleString("vi-VN", {
        maximumFractionDigits: 0,
      }) + " ₫");

  // Map transaction status to a Bootstrap color
  const statusColor = (s) => {
    const key = String(s || "").toLowerCase();
    if (key === "completed") return "success";
    if (key === "failed") return "danger";
    if (key === "pending") return "secondary";
    return "secondary";
  };

  // Map transaction type to a Bootstrap color
  const typeColor = (t) => {
    const key = String(t || "").toLowerCase();
    switch (key) {
      case "topup":
        return "info";
      case "paysalary":
        return "warning";
      case "paymembership":
        return "primary";
      case "orderpayment":
        return "success";
      case "refund":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Best-effort meta parser (supports object or JSON string)
  const parseMeta = (meta) => {
    try {
      if (!meta) return null;
      if (typeof meta === "string") return JSON.parse(meta);
      if (typeof meta === "object") return meta;
      return null;
    } catch {
      return null;
    }
  };

  // Build a concise meta line depending on the transaction type
  const renderMetaLine = (tx) => {
    const meta = parseMeta(tx.metaJson);
    if (!meta) return null;

    const t = String(tx.type || "").toLowerCase();

    if (t === "paymembership" && meta.plan) {
      return <div className="small text-muted">Plan: {meta.plan}</div>;
    }

    if (t === "orderpayment" && (meta.orderId || meta.riderUserId)) {
      return (
        <div className="small text-muted">
          Order: {meta.orderId || "-"} · Rider: {meta.riderUserId || "-"}
        </div>
      );
    }

    if (t === "paysalary" && (meta.driverUserId || meta.companyId)) {
      return (
        <div className="small text-muted">
          Driver: {meta.driverUserId || "-"} · Company: {meta.companyId || "-"}
        </div>
      );
    }

    if (t === "topup" && (meta.source || meta.companyId)) {
      return (
        <div className="small text-muted">
          Source: {meta.source || "external"} · Company: {meta.companyId || "-"}
        </div>
      );
    }

    // fallback: show the first 3 keys
    const keys = Object.keys(meta || {}).slice(0, 3);
    if (!keys.length) return null;

    return (
      <div className="small text-muted">
        {keys.map((k, i) => (
          <span key={k}>
            {i > 0 ? " · " : ""}
            {k}: {String(meta[k])}
          </span>
        ))}
      </div>
    );
  };

  // Compute sign and color from the perspective of a given wallet
  const resolveSignedAmount = (tx) => {
    const cents = Number(tx.amountCents) || 0;

    // No perspective -> neutral text
    if (!perspectiveWalletId) {
      return { text: baseFormatAmount(cents), className: "" };
    }

    const isIncome = tx.toWalletId && tx.toWalletId === perspectiveWalletId;
    const isExpense =
      tx.fromWalletId && tx.fromWalletId === perspectiveWalletId;

    if (isIncome) {
      return {
        text: `+${baseFormatAmount(cents)}`,
        className: "text-success",
      };
    }

    if (isExpense) {
      return {
        text: `-${baseFormatAmount(cents)}`,
        className: "text-danger",
      };
    }

    // Unrelated to this wallet -> neutral
    return { text: baseFormatAmount(cents), className: "text-muted" };
  };

  // Respect optional limit for compact lists
  const sliced = typeof limit === "number" ? items.slice(0, limit) : items;

  return (
    <ListGroup variant="flush">
      {sliced.length ? (
        sliced.map((t) => {
          const amt = resolveSignedAmount(t);
          return (
            <ListGroup.Item
              key={t.id}
              className="d-flex justify-content-between align-items-center"
              // If onItemClick is provided, make the row interactive
              action={!!onItemClick}
              onClick={onItemClick ? () => onItemClick(t) : undefined}
            >
              <div>
                {/* Localized datetime (browser locale/timezone) */}
                <div className="small text-muted">
                  {new Date(t.createdAt).toLocaleString()}
                </div>

                {/* Status text + type/status badges */}
                <div className="fw-semibold d-flex align-items-center gap-2">
                  <span>{t.status}</span>
                  {t.type ? (
                    <Badge bg={typeColor(t.type)} className="text-uppercase">
                      {t.type}
                    </Badge>
                  ) : null}
                  <Badge bg={statusColor(t.status)}>{t.status}</Badge>
                </div>

                {renderMetaLine(t)}
              </div>

              {/* Signed amount (from perspectiveWalletId) */}
              <div className={`fw-bold ${amt.className}`}>{amt.text}</div>
            </ListGroup.Item>
          );
        })
      ) : (
        <ListGroup.Item className="text-muted fst-italic">
          {emptyText}
        </ListGroup.Item>
      )}
    </ListGroup>
  );
}
