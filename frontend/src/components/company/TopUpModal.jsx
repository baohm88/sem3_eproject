import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import ModalBase from "../../ui/ModalBase";
import { topupCompanyWallet, getCompanyWallet } from "../../api/companies";

// util nhỏ
const toCents = (v) => Math.round(parseFloat(String(v).replace(/,/g, ".")) * 100) || 0;

export default function TopUpModal({ show, onHide, companyId, onDone }) {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

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
        idempotencyKey: `topup-${companyId}-${Date.now()}`,
      });
      toast.success("Top up successful");
      onHide?.();
      // Optional refresh balance
      try { await getCompanyWallet(companyId); } catch {}
      onDone?.();
    } catch (e) {
      toast.error(e.message || "Top up failed");
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
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <InputGroup.Text>₫</InputGroup.Text>
        </InputGroup>
        <Form.Text className="text-muted">
          Số tiền sẽ được nạp (mock) vào ví Company của bạn.
        </Form.Text>
      </Form>
    </ModalBase>
  );
}
