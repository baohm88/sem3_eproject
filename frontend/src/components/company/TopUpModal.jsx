import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import ModalBase from "../../ui/ModalBase";
import { topupCompanyWallet, getCompanyWallet } from "../../api/companies";

/**
 * Small utility: convert user-entered amount to cents.
 * - Accepts comma as decimal separator.
 * - Falls back to 0 on NaN.
 */
const toCents = (v) =>
  Math.round(parseFloat(String(v).replace(/,/g, ".")) * 100) || 0;

/**
 * TopUpModal
 * Modal for (mock) topping up a company's wallet.
 *
 * Props:
 * - show: boolean — control visibility
 * - onHide: () => void — close handler
 * - companyId: string — target company id
 * - onDone?: () => void — optional callback after successful top-up (e.g., refresh parent)
 */
export default function TopUpModal({ show, onHide, companyId, onDone }) {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  // Validate and perform top-up with a simple idempotency key
  const confirm = async () => {
    const amountCents = toCents(amount);
    if (amountCents <= 0) {
      toast.error("Amount must be > 0");
      return;
    }
    try {
      setBusy(true);
      await topupCompanyWallet(companyId, {
        amountCents,
        idempotencyKey: `topup-${companyId}-${Date.now()}`, // basic idempotency guard
      });
      toast.success("Top up successful");
      onHide?.();

      // Optional: refresh balance silently; tolerate errors
      try {
        await getCompanyWallet(companyId);
      } catch {}

      // Notify parent to re-fetch data if desired
      onDone?.();
    } catch (e) {
      toast.error(e?.message || "Top up failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalBase
      show={show}
      onHide={onHide}
      title="Top Up Wallet"
      confirmText="Top Up"
      onConfirm={confirm}
      busy={busy}
    >
      <Form>
        <Form.Label>Amount (VND)</Form.Label>
        <InputGroup>
          <Form.Control
            placeholder="e.g. 200000"
            inputMode="numeric" // nudge mobile keyboards to numeric layout
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <InputGroup.Text>₫</InputGroup.Text>
        </InputGroup>
        <Form.Text className="text-muted">
          The amount will be (mock) deposited into your Company wallet.
        </Form.Text>
      </Form>
    </ModalBase>
  );
}
