import { useEffect, useMemo, useState } from "react";
import {
    Button,
    Card,
    Col,
    Form,
    InputGroup,
    Modal,
    Row,
    Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
    getMyCompany,
    getCompanyWallet,
    payMembership,
} from "../../api/companies";
import TopUpModal from "./TopUpModal";

const MEMBERSHIPS = [
    { id: "Free", label: "Free", priceCents: 0 },
    { id: "Basic", label: "Basic", priceCents: 1000 },
    { id: "Premium", label: "Premium", priceCents: 3000 },
];

function cents(v) {
    return (v / 100).toLocaleString("vi-VN");
}

export default function CompanyMembershipCard() {
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [showPay, setShowPay] = useState(false);
    const [showTopUp, setShowTopUp] = useState(false);
    const [planId, setPlanId] = useState("Basic");
    const [processing, setProcessing] = useState(false);

    const selectedPlan = useMemo(
        () => MEMBERSHIPS.find((p) => p.id === planId) ?? MEMBERSHIPS[1],
        [planId]
    );

    const refresh = async () => {
        setLoading(true);
        try {
            const c = await getMyCompany();
            setCompany(c);
            const w = await getCompanyWallet(c.id);
            setWallet(w);
        } catch (e) {
            toast.error(e.message || "Cannot load membership");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const openPay = () => setShowPay(true);
    const closePay = () => setShowPay(false);

    const handlePay = async () => {
        if (!company?.id) return;
        if (!selectedPlan) return toast.error("Select a plan");
        try {
            setProcessing(true);
            const payload = {
                plan: selectedPlan.id,
                amountCents: selectedPlan.priceCents,
                idempotencyKey: `pay-membership-${company.id}-${
                    selectedPlan.id
                }-${new Date().toISOString()}`,
            };
            const res = await payMembership(company.id, payload);
            toast.success(
                `Paid ${selectedPlan.label}. Expires: ${new Date(
                    res.expiresAt
                ).toLocaleDateString()}`
            );
            setShowPay(false);
            await refresh();
        } catch (e) {
            if (e.code === "INSUFFICIENT_FUNDS") {
                toast.error("Số dư không đủ. Hãy Top Up trước.");
            } else {
                toast.error(e.message || "Pay membership failed");
            }
        } finally {
            setProcessing(false);
        }
    };

    if (loading)
        return (
            <Card className="border-0 shadow-sm">
                <Card.Body className="py-4 text-center">
                    <Spinner animation="border" />
                </Card.Body>
            </Card>
        );

    return (
        <>
            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Row className="gy-3 align-items-center">
                        <Col xs={12} md>
                            <div className="d-flex flex-column">
                                <div className="d-flex gap-2 align-items-center">
                                    <h5 className="mb-0">Membership</h5>
                                    <span className="badge text-bg-primary">
                                        {company?.membership || "Free"}
                                    </span>
                                </div>
                                <div className="text-muted small">
                                    Expires:{" "}
                                    {company?.membershipExpiresAt
                                        ? new Date(
                                              company.membershipExpiresAt
                                          ).toLocaleDateString()
                                        : "—"}
                                </div>
                            </div>
                        </Col>
                        <Col xs="auto" className="text-md-end">
                            <div className="small text-muted">Balance</div>
                            <div className="fs-5 fw-semibold">
                                {wallet
                                    ? `${cents(wallet.balanceCents)} $`
                                    : "—"}
                            </div>
                        </Col>
                        <Col xs="auto" className="d-flex gap-2">
                            <Button
                                variant="success"
                                onClick={() => setShowTopUp(true)}
                            >
                                Top Up
                            </Button>
                            <Button onClick={openPay}>Choose / Pay Plan</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Pay modal */}
            <Modal show={showPay} onHide={closePay} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Choose membership</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>Plan</Form.Label>
                        <Form.Select
                            value={planId}
                            onChange={(e) => setPlanId(e.target.value)}
                        >
                            {MEMBERSHIPS.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.label} —{" "}
                                    {p.priceCents
                                        ? `${cents(p.priceCents)} $ / month`
                                        : "Free"}
                                </option>
                            ))}
                        </Form.Select>
                        <div className="mt-3 small text-muted">
                            Payment will deduct from your company wallet.
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={closePay}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePay}
                        disabled={processing || !selectedPlan}
                    >
                        {processing ? <Spinner size="sm" /> : "Pay"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Topup Modal */}
            <TopUpModal
                show={showTopUp}
                onHide={() => setShowTopUp(false)}
                companyId={company.id}
                onDone={refresh}
            />
        </>
    );
}
