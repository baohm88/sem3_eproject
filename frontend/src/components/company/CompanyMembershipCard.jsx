import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getMyCompany, getCompanyWallet, payMembership } from "../../api/companies";
import TopUpModal from "./TopUpModal";

// Available membership plans (mock pricing in cents)
const MEMBERSHIPS = [
  { id: "Free", label: "Free", priceCents: 0 },
  { id: "Basic", label: "Basic", priceCents: 1000 },
  { id: "Premium", label: "Premium", priceCents: 3000 },
];

// Helper: format cents using vi-VN locale (no currency suffix here)
function cents(v) {
  return (v / 100).toLocaleString("vi-VN");
}

/**
 * CompanyMembershipCard
 * Shows current membership state, company wallet balance, and allows choosing/paying a plan.
 * Also provides a Top Up flow for insufficient funds.
 */
export default function CompanyMembershipCard() {
  // Loading flags and fetched entities
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [wallet, setWallet] = useState(null);

  // UI state for modals and selection
  const [showPay, setShowPay] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [planId, setPlanId] = useState("Basic");
  const [processing, setProcessing] = useState(false);

  // Currently selected plan (fallback to Basic if unknown)
  const selectedPlan = useMemo(
    () => MEMBERSHIPS.find((p) => p.id === planId) ?? MEMBERSHIPS[1],
    [planId]
  );

  // Fetch latest company + wallet data
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

  // Initial load
  useEffect(() => {
    refresh();
  }, []);

  // Modal toggles
  const openPay = () => setShowPay(true);
  const closePay = () => setShowPay(false);

  // Trigger membership payment using the selected plan
  const handlePay = async () => {
    if (!company?.id) return;
    if (!selectedPlan) return toast.error("Select a plan");
    try {
      setProcessing(true);

      // Build a simple idempotency key to avoid duplicate charges
      const payload = {
        plan: selectedPlan.id,
        amountCents: selectedPlan.priceCents,
        idempotencyKey: `pay-membership-${company.id}-${selectedPlan.id}-${new Date().toISOString()}`,
      };

      const res = await payMembership(company.id, payload);

      toast.success(
        `Paid ${selectedPlan.label}. Expires: ${new Date(res.expiresAt).toLocaleDateString()}`
      );

      setShowPay(false);
      await refresh();
    } catch (e) {
      // Keep the original message (Vietnamese) for UX consistency
      if (e.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient balance. Top Up first.");
      } else {
        toast.error(e.message || "Pay membership failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  // Loading placeholder card
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
      {/* Membership summary + wallet balance + actions */}
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
                    ? new Date(company.membershipExpiresAt).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </Col>

            {/* Wallet balance section (displayed in locale, with a "$" suffix per current UI) */}
            <Col xs="auto" className="text-md-end">
              <div className="small text-muted">Balance</div>
              <div className="fs-5 fw-semibold">
                {wallet ? `${cents(wallet.balanceCents)} $` : "—"}
              </div>
            </Col>

            {/* Main actions: Top Up & Pay */}
            <Col xs="auto" className="d-flex gap-2">
              <Button variant="success" onClick={() => setShowTopUp(true)}>
                Top Up
              </Button>
              <Button onClick={openPay}>Choose / Pay Plan</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Pay modal: choose a plan and confirm payment */}
      <Modal show={showPay} onHide={closePay} centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose membership</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Plan</Form.Label>
            <Form.Select value={planId} onChange={(e) => setPlanId(e.target.value)}>
              {MEMBERSHIPS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} — {p.priceCents ? `${cents(p.priceCents)} $ / month` : "Free"}
                </option>
              ))}
            </Form.Select>

            {/* Inform the user about the payment source */}
            <div className="mt-3 small text-muted">
              Payment will deduct from your company wallet.
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closePay} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handlePay} disabled={processing || !selectedPlan}>
            {processing ? <Spinner size="sm" /> : "Pay"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Top Up modal: add funds to company wallet before paying */}
      <TopUpModal
        show={showTopUp}
        onHide={() => setShowTopUp(false)}
        companyId={company.id}
        onDone={refresh}
      />
    </>
  );
}
