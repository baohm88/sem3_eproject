import { ListGroup, Badge } from "react-bootstrap";

export default function TransactionList({
  transactions = [],
  emptyText = "No transactions",
  limit,
  formatAmount,
  onItemClick,
  perspectiveWalletId,
}) {
  const items = Array.isArray(transactions) ? transactions : [];

  const baseFormatAmount =
    formatAmount ||
    ((cents) =>
      (Math.round(cents) / 100).toLocaleString("vi-VN", {
        maximumFractionDigits: 0,
      }) + " ₫");

  const statusColor = (s) => {
    const key = String(s || "").toLowerCase();
    if (key === "completed") return "success";
    if (key === "failed") return "danger";
    if (key === "pending") return "secondary";
    return "secondary";
  };

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
    // fallback: hiển thị 3 key đầu
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

  // Tính toán dấu và màu theo góc nhìn một ví
  const resolveSignedAmount = (tx) => {
    const cents = Number(tx.amountCents) || 0;
    if (!perspectiveWalletId) {
      return { text: baseFormatAmount(cents), className: "" };
    }
    const isIncome = tx.toWalletId && tx.toWalletId === perspectiveWalletId;
    const isExpense = tx.fromWalletId && tx.fromWalletId === perspectiveWalletId;

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
    // không liên quan trực tiếp ví này → trung tính
    return { text: baseFormatAmount(cents), className: "text-muted" };
  };

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
              action={!!onItemClick}
              onClick={onItemClick ? () => onItemClick(t) : undefined}
            >
              <div>
                <div className="small text-muted">
                  {new Date(t.createdAt).toLocaleString()}
                </div>
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
