import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import type { MoneyIntentPayload } from "./WithdrawModal";

type TopUpModalProps = {
    show: boolean;
    onHide: () => void;
    onConfirm: (p: MoneyIntentPayload) => Promise<any>;

    title?: string; // default: "Top Up Wallet"
    confirmLabel?: string; // default: "Top Up"
    currencyLabel?: string; // default: "VND"
    helpText?: string; // default: "Mock top-up (demo)."
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
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Amount ({currencyLabel})</Form.Label>
                        <Form.Control
                            placeholder="e.g. 500000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            inputMode="decimal"
                        />
                        <Form.Text className="text-muted">{helpText}</Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    onClick={onHide}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button variant="success" onClick={submit} disabled={loading}>
                    {loading ? <Spinner size="sm" /> : confirmLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
