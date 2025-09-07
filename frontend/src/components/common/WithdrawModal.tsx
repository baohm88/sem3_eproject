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
  /** handler gọi API rút tiền tương ứng (company/driver/rider/admin) */
  onConfirm: (p: MoneyIntentPayload) => Promise<any>;

  // tuỳ biến UI
  title?: string;                 // default: "Withdraw"
  confirmLabel?: string;          // default: "Withdraw"
  currencyLabel?: string;         // default: "VND"
  helpText?: string;              // default: "Mock withdraw (demo)."
  /** số tiền gợi ý (đơn vị cents) */
  defaultAmountCents?: number;
};

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

  useEffect(() => {
    if (show) {
      setLoading(false);
      setNote("");
      if (defaultAmountCents && defaultAmountCents > 0) {
        setAmount(String(Math.round(defaultAmountCents / 100)));
      } else {
        setAmount("");
      }
    }
  }, [show, defaultAmountCents]);

  const toCents = () => {
    const v = parseFloat(String(amount).replace(/,/g, "."));
    if (isNaN(v) || v <= 0) return null;
    return Math.round(v * 100);
  };

  const submit = async () => {
    const cents = toCents();
    if (!cents) return toast.error("Please enter a valid amount (> 0).");
    try {
      setLoading(true);
      await onConfirm({
        amountCents: cents,
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
      <Modal.Header closeButton><Modal.Title>{title}</Modal.Title></Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Amount ({currencyLabel})</Form.Label>
            <Form.Control
              placeholder="e.g. 200000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
            />
            <Form.Text className="text-muted">{helpText}</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={submit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
