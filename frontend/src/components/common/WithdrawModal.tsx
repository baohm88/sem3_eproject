import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export type MoneyIntentPayload = {
  amountCents: number;
  idempotencyKey?: string;
  note?: string;
};

type WithdrawModalProps = {
  show: boolean;
  onHide: () => void;
  /** handler to call the corresponding withdraw API (company/driver/rider/admin) */
  onConfirm: (p: MoneyIntentPayload) => Promise<any>;

  // UI customization
  title?: string;                 // default: "Withdraw"
  confirmLabel?: string;          // default: "Withdraw"
  currencyLabel?: string;         // default: "VND"
  helpText?: string;              // default: "Mock withdraw (demo)."
  /** suggested amount (in cents) */
  defaultAmountCents?: number;
};

/**
 * WithdrawModal
 * Simple, reusable modal to perform a withdrawal.
 * Renders amount input, optional note, and confirm/cancel actions.
 * NOTE: If you are using TypeScript, consider renaming the file to .tsx.
 */
export default function WithdrawModal({
  show,
  onHide,
  onConfirm,
  title = "Withdraw",
  confirmLabel = "Withdraw",
  currencyLabel = "VND",
  helpText = "Mock withdraw (demo).",
  defaultAmountCents,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // When opening -> reset state and prefill from defaultAmountCents
  useEffect(() => {
    if (show) {
      setLoading(false);
      setNote("");
      if (defaultAmountCents && defaultAmountCents > 0) {
        // Display amount as whole currency units (cents -> units)
        setAmount(String(Math.round(defaultAmountCents / 100)));
      } else {
        setAmount("");
      }
    }
  }, [show, defaultAmountCents]);

  // Parse user input into cents (accepts comma as decimal separator)
  const toCents = () => {
    const v = parseFloat(String(amount).replace(/,/g, "."));
    if (isNaN(v) || v <= 0) return null;
    return Math.round(v * 100);
  };

  // Submit handler with basic validation and idempotency
  const submit = async () => {
    const cents = toCents();
    if (!cents) return toast.error("Please enter a valid amount (> 0).");
    try {
      setLoading(true);
      await onConfirm({
        amountCents: cents,
        // Use a unique key to prevent duplicate submissions (when supported)
        idempotencyKey: (crypto as any)?.randomUUID?.(),
        note,
      });
      toast.success(`${confirmLabel} success!`);
      onHide();
    } catch (e: any) {
      toast.error(e?.message || `${confirmLabel} failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Amount input */}
          <Form.Group className="mb-3">
            <Form.Label>Amount ({currencyLabel})</Form.Label>
            <Form.Control
              placeholder="e.g. 200000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal" // helps mobile keyboards show numeric layout
            />
            <Form.Text className="text-muted">{helpText}</Form.Text>
          </Form.Group>

          {/* Optional note (kept minimal; add if needed) */}
          {/* <Form.Group className="mb-3">
            <Form.Label>Note</Form.Label>
            <Form.Control
              placeholder="Optional note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group> */}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {/* Secondary action: close modal */}
        <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>

        {/* Primary action: confirm withdraw */}
        <Button variant="danger" onClick={submit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
