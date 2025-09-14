import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, InputGroup, Spinner } from "react-bootstrap";

/** Convert user-entered amount (supports comma decimals) to cents; returns NaN if invalid/non-positive */
function toCentsSafe(v) {
  const n = parseFloat(String(v).replace(/,/g, "."));
  if (Number.isFinite(n) && n > 0) return Math.round(n * 100);
  return NaN;
}

/** Get current UTC month as "YYYY-MM" (used as default salary period) */
function thisUtcMonth() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function PaySalaryModal({
  show,
  onHide,
  driver,            // { userId, fullName, ... }
  defaultPeriod,     // optional, "YYYY-MM"
  onConfirm,         // ({ driverUserId, amountCents, period?, note?, idempotencyKey? }) => Promise<any>
}) {
  const [amount, setAmount] = useState("");     // VND (display units)
  const [period, setPeriod] = useState(defaultPeriod || thisUtcMonth());
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset form state whenever the modal opens (or defaultPeriod changes)
  useEffect(() => {
    if (show) {
      setAmount("");
      setNote("");
      setPeriod(defaultPeriod || thisUtcMonth());
    }
  }, [show, defaultPeriod]);

  // Idempotency key:
  // Leave undefined -> BE will normalize; if you want to set manually, uncomment below.
  const idemKey = useMemo(() => {
    // return `salary:${driver?.userId}:${period}:${amount || 0}`;
    return undefined;
  }, [driver?.userId, period, amount]);

  // Validate and submit
  const doConfirm = async () => {
    if (!driver?.userId) return;
    const cents = toCentsSafe(amount);
    if (!Number.isFinite(cents)) return alert("Amount phải là số dương");
    setSaving(true);
    try {
      await onConfirm({
        driverUserId: driver.userId,
        amountCents: cents,
        period,
        note: note?.trim() || undefined,
        idempotencyKey: idemKey, // can be undefined
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Pay Salary</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-2 text-muted small">
          Driver: <strong>{driver?.fullName || driver?.userId || "—"}</strong>
        </div>

        <Form>
          {/* Period input (string "YYYY-MM"); defaults to current UTC month */}
          <Form.Group className="mb-3">
            <Form.Label>Period (YYYY-MM)</Form.Label>
            <Form.Control
              placeholder="2025-09"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
            <Form.Text className="text-muted">
              Mặc định là tháng UTC hiện tại. Dùng để chống trả trùng kỳ.
            </Form.Text>
          </Form.Group>

          {/* Amount input (display units), converted to cents on submit */}
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <Form.Control
                placeholder="Example: 1,500,000"
                inputMode="decimal" // helps mobile keyboards show numeric layout
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <InputGroup.Text>VND</InputGroup.Text>
            </InputGroup>
          </Form.Group>

          {/* Optional internal note */}
          <Form.Group className="mb-2">
            <Form.Label>Note (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={doConfirm} disabled={saving || !driver?.userId}>
          {saving ? <Spinner size="sm" /> : "Pay"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
