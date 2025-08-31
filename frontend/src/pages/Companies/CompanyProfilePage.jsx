import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Image,
  Modal,
  Form,
  Spinner,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getMyCompany,
  updateMyCompany,
  getCompanyWallet,
  listCompanyTransactions,
} from "../../api/companies";
import TopUpModal from "../../components/company/TopUpModal";

// (Giữ lại) Modal sửa hồ sơ công ty
function EditProfileModal({ show, onHide, initial, onSave }) {
  const [form, setForm] = useState({ name: "", description: "", imgUrl: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial)
      setForm({
        name: initial.name ?? "",
        description: initial.description ?? "",
        imgUrl: initial.imgUrl ?? "",
      });
  }, [initial]);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const cleanPayload = (obj) => {
    const out = {};
    for (const [k, v] of Object.entries(obj || {})) {
      if (v === "" || v === undefined) continue;
      out[k] = v;
    }
    return out;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(cleanPayload(form));
      onHide?.();
      toast.success("Updated company profile!");
    } catch (e) {
      toast.error(e.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Company</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Company name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What does your company do?"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Logo URL</Form.Label>
            <Form.Control
              name="imgUrl"
              value={form.imgUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
            <Form.Text muted>Leave blank to keep current.</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? <Spinner size="sm" /> : "Save changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [txs, setTxs] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

  const dashboardPath = useMemo(() => "/company", []);
  const placeholderLogo =
    "https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=1200&auto=format&fit=crop&q=60";

  const refreshWalletAndTx = async (cid) => {
    try {
      const w = await getCompanyWallet(cid);
      setWallet(w);
      const tRes = await listCompanyTransactions(cid, { size: 5, page: 1 });
      setTxs(tRes.items || []);
    } catch {
      // optional
    }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const c = await getMyCompany();
      setCompany(c);
      await refreshWalletAndTx(c.id);
    } catch (e) {
      toast.error(e.message || "Cannot load company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const membershipBadge = (m, expires) => (
    <Badge
      bg={m === "Pro" ? "success" : m === "Business" ? "primary" : "secondary"}
    >
      {m || "Free"}
      {expires ? ` · exp ${new Date(expires).toLocaleDateString()}` : ""}
    </Badge>
  );

  const onSave = async (payload) => {
    const updated = await updateMyCompany(payload);
    setCompany(updated);
  };

  const centsToVnd = (c) =>
    (Math.round(c) / 100).toLocaleString("vi-VN", {
      maximumFractionDigits: 0,
    });

  if (loading) {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="py-5 text-center text-muted">No company profile.</div>
    );
  }

  return (
    <>
      <Row className="gy-3 align-items-stretch mt-3">
        {/* Left column – identity */}
        <Col xs={12} md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex gap-3 align-items-center">
              <Image
                src={company.imgUrl || placeholderLogo}
                roundedCircle
                style={{ width: 96, height: 96, objectFit: "cover" }}
                alt="Logo"
              />
              <div className="flex-grow-1">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <h4 className="mb-0">{company.name || "Unnamed Company"}</h4>
                  {membershipBadge(
                    company.membership,
                    company.membershipExpiresAt
                  )}
                  {company.isActive ? (
                    <Badge bg="primary" className="border">
                      Active
                    </Badge>
                  ) : (
                    <Badge bg="secondary">Inactive</Badge>
                  )}
                </div>
                {company.description ? (
                  <div className="text-muted mt-2">{company.description}</div>
                ) : (
                  <div className="text-muted mt-2 fst-italic">
                    No description yet.
                  </div>
                )}
                <div className="mt-3 d-flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setShowEdit(true)}
                  >
                    Edit profile
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    href={dashboardPath}
                  >
                    Go to dashboard
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right column – wallet & stats */}
        <Col xs={12} md={6} lg={7}>
          <Row className="g-3">
            <Col xs={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted">Wallet balance</div>
                      <h3 className="mb-0">
                        {wallet ? centsToVnd(wallet.balanceCents) : "--"} ₫
                      </h3>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => setShowTopUp(true)}
                      >
                        Top up
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      now={Math.min(
                        100,
                        ((wallet?.balanceCents ?? 0) /
                          Math.max(1, wallet?.lowBalanceThreshold ?? 100000)) *
                          100
                      )}
                    />
                    <div className="small text-muted mt-1">
                      Low balance threshold:{" "}
                      {wallet
                        ? centsToVnd(wallet.lowBalanceThreshold)
                        : "--"}{" "}
                      ₫
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12}>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <strong>Recent Transactions</strong>
                </Card.Header>
                <ListGroup variant="flush">
                  {txs?.length ? (
                    txs.map((t) => (
                      <ListGroup.Item
                        key={t.id}
                        className="d-flex justify-content-between"
                      >
                        <div>
                          <div className="small text-muted">
                            {new Date(t.createdAt).toLocaleString()}
                          </div>
                          <div className="fw-semibold">{t.status}</div>
                        </div>
                        <div className="fw-bold">
                          {centsToVnd(t.amountCents)} ₫
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-muted fst-italic">
                      No transactions
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <EditProfileModal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        initial={company}
        onSave={onSave}
      />

      <TopUpModal
        show={showTopUp}
        onHide={() => setShowTopUp(false)}
        companyId={company.id}
        onDone={() => refreshWalletAndTx(company.id)}
      />
    </>
  );
}