import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import type { MoneyIntentPayload } from "./WithdrawModal";

/**
 * TopUpModal
 *
 * A reusable modal for topping up a wallet.
 *
 * Props:
 * - show: boolean — whether the modal is visible
 * - onHide: () => void — close handler (parent controls visibility)
 * - onConfirm: (p: MoneyIntentPayload) => Promise<any>
 *     Async handler invoked on submit with:
 *       { amountCents: number, idempotencyKey?: string, note?: string }
 * - title?: string           — header title (default: "Top Up Wallet")
 * - confirmLabel?: string    — confirm button label (default: "Top Up")
 * - currencyLabel?: string   — text hint for currency (default: "VND")
 * - helpText?: string        — small helper text under the input (default: "Mock top-up (demo).")
 * - defaultAmountCents?: number — optional prefill in CENTS (will be shown as whole currency units)
 *
 * UX notes:
 * - Input is in whole currency units (e.g., "500000" VND), then converted to cents internally.
 * - Uses a generated `idempotencyKey` to help backends deduplicate requests.
 */
type TopUpModalProps = {
  show: boolean;
  onHide: () => void;
  onConfirm: (p: MoneyIntentPayload) => Promise<any>;

  title?: string;           // default: "Top Up Wallet"
  confirmLabel?: string;    // default: "Top Up"
  currencyLabel?: string;   // default: "VND"
  helpText?: string;        // default: "Mock top-up (demo)."
  defaultAmountCents?: number;
};

export default function TopUpModal({
  show,
  onHide,
  onConfirm,
  title = "Top Up Wallet",
  confirmLabel = "Top Up",
  currencyLabel = "VND",
  helpText = "Mock top-up (demo).",
  defaultAmountCents,
}: TopUpModalProps) {
  // String state so the input can accept partial/invalid numbers while typing
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Reset form when the modal opens (or when defaultAmountCents changes)
  useEffect(() => {
    if (show) {
      setLoading(false);
      setNote("");
      if (defaultAmountCents && defaultAmountCents > 0) {
        // Display as whole currency units (e.g., 150000 cents => "1500")
        setAmount(String(Math.round(defaultAmountCents / 100)));
      } else {
        setAmount("");
      }
    }
  }, [show, defaultAmountCents]);

  // Convert the UI amount (whole currency units) into cents
  const toCents = () => {
    const v = parseFloat(String(amount).replace(/,/g, "."));
    if (isNaN(v) || v <= 0) return null;
    return Math.round(v * 100);
  };

  // Submit handler: validates amount, calls onConfirm, shows toast feedback
  const submit = async () => {
    const cents = toCents();
    if (!cents) return toast.error("Please enter a valid amount (> 0).");
    try {
      setLoading(true);
      await onConfirm({
        amountCents: cents,
        idempotencyKey: (crypto as any)?.randomUUID?.(), // helps prevent duplicate top-ups
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
          {/* Amount input (in whole currency units; converted to cents on submit) */}
          <Form.Group className="mb-3">
            <Form.Label>Amount ({currencyLabel})</Form.Label>
            <Form.Control
              placeholder="e.g. 500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              aria-label={`Top-up amount in ${currencyLabel}`}
            />
            <Form.Text className="text-muted">{helpText}</Form.Text>
          </Form.Group>

          {/* Optional note (not shown in UI yet, but kept for extensibility) */}
          {/* <Form.Group className="mb-3">
            <Form.Label>Note (optional)</Form.Label>
            <Form.Control
              placeholder="Add a note for this top-up (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group> */}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="success" onClick={submit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
