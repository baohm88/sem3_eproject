// src/pages/Companies/CompanyServices.jsx
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  InputGroup,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getMyCompany,
  listCompanyServices,
  createCompanyService,
  updateCompanyService,
  pauseCompanyService,
  reactivateCompanyService,
} from "../../api/companies";
import ServiceCard from "../../components/common/ServiceCard";

function centsToVnd(cents) {
  return (cents / 100).toLocaleString("vi-VN");
}

// Remove empty/undefined/null fields before sending to API
function cleanPayload(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v === "" || v === undefined || v === null) continue;
    out[k] = v;
  }
  return out;
}

function ServiceEditorModal({ show, onHide, initial, onSubmit }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({ title: "", imgUrl: "", description: "", price: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize form from "initial" (edit) or reset (create)
    if (initial) {
      setForm({
        title: initial.title ?? "",
        imgUrl: initial.imgUrl ?? "",
        description: initial.description ?? "",
        price: initial.priceCents ? String(initial.priceCents / 100) : "",
      });
    } else {
      setForm({ title: "", description: "", price: "" });
    }
  }, [initial, show]);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    const priceNum = parseFloat(String(form.price).replace(/,/g, "."));
    if (!form.title?.trim()) return toast.error("Title is required");
    if (isNaN(priceNum) || priceNum <= 0) return toast.error("Price must be a positive number");

    try {
      setSaving(true);
      await onSubmit({
        title: form.title.trim(),
        imgUrl: form.imgUrl?.trim() || null,
        description: form.description?.trim(),
        // Store as cents
        priceCents: Math.round(priceNum * 100),
      });
      onHide?.();
      toast.success(isEdit ? "Updated service" : "Created service");
    } catch (e) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit Service" : "New Service"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              placeholder="e.g. 4-seater Airport Pickup"
              value={form.title}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              name="imgUrl"
              placeholder="placeholder: https://..."
              value={form.imgUrl}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Short description to attract riders & drivers"
              value={form.description}
              onChange={onChange}
            />
            <Form.Text className="text-muted">
              Tip: clearly state the scope, time, and benefits for drivers & riders.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            {/* NOTE: Value is displayed/entered in VND base units and converted to cents */}
            <Form.Label>Unit Price/km (VND)</Form.Label>
            <InputGroup>
              <Form.Control
                name="price"
                placeholder="e.g. 120000"
                inputMode="numeric"
                value={form.price}
                onChange={onChange}
              />
              <InputGroup.Text>VND</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? <Spinner size="sm" /> : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function CompanyServices() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [services, setServices] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 12,
    totalItems: 0,
  });
  const [q, setQ] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);
  document.title = "Your Services - Mycabs.com"

  const fetchAll = async (page = 1, query = "") => {
    if (!company?.id) return;
    setLoading(true);
    try {
      const res = await listCompanyServices(
        company.id,
        cleanPayload({ page, size: pageInfo.size, q: query })
      );

      setServices(res.items || []);
      setPageInfo({
        page: res.page,
        size: res.size,
        totalItems: res.totalItems,
      });
    } catch (e) {
      toast.error(e.message || "Cannot load services");
    } finally {
      setLoading(false);
    }
  };

  // Load company profile on mount
  useEffect(() => {
    (async () => {
      try {
        const c = await getMyCompany();
        setCompany(c);
      } catch (e) {
        toast.error(e.message || "Cannot load company");
      }
    })();
  }, []);

  // Load services when company is ready
  useEffect(() => {
    if (company?.id) fetchAll(1, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company?.id]);

  // Debounce search term
  useEffect(() => {
    if (!company?.id) return;
    const t = setTimeout(() => {
      fetchAll(1, q);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const openCreate = () => {
    setEditing(null);
    setShowEditor(true);
  };
  const openEdit = (svc) => {
    setEditing(svc);
    setShowEditor(true);
  };

  const onSubmitEditor = async (payload) => {
    if (!company?.id) throw new Error("Missing company id");
    if (editing?.id) {
      await updateCompanyService(company.id, editing.id, payload);
    } else {
      await createCompanyService(company.id, payload);
    }
    await fetchAll(pageInfo.page, q);
  };

  const toggleActive = async (svc) => {
    if (!company?.id) return;
    const doPause = svc.isActive;
    if (
      !window.confirm(
        doPause
          ? "Pause this service? Riders won't see it and drivers can't apply."
          : "Reactivate this service?"
      )
    )
      return;

    try {
      setBusyId(svc.id);
      if (doPause) await pauseCompanyService(company.id, svc.id);
      else await reactivateCompanyService(company.id, svc.id);
      toast.success(doPause ? "Service paused" : "Service reactivated");
      await fetchAll(pageInfo.page, q);
    } catch (e) {
      toast.error(e.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const placeholderBanner =
    "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="py-3">
      {/* Header strip */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center gap-2">
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <Image
              src={
                company?.imgUrl ||
                "https://dummyimage.com/80x80/eee/aaa&text=Logo"
              }
              roundedCircle
              style={{ width: 56, height: 56, objectFit: "cover" }}
            />
            <div>
              <div className="fw-semibold">
                {company?.name || "Your company"}
              </div>
              <div className="text-muted small">
                Create attractive services to convert riders & recruit drivers
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Form.Control
              placeholder="Search your services..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button onClick={openCreate}>+ New Service</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="py-5 text-center">
          <Spinner animation="border" />
        </div>
      ) : services.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <div className="mb-3">
              <Image
                src={placeholderBanner}
                rounded
                style={{ width: "100%", maxWidth: 520, objectFit: "cover" }}
              />
            </div>
            <h5 className="fw-semibold">No services yet</h5>
            <p className="text-muted">
              Add your first service to attract customers and drivers.
            </p>
            <Button onClick={openCreate}>Create Service</Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-3">
          {services.map((svc) => (
            <Col xs={12} sm={6} lg={4} key={svc.id}>
              <>
                <ServiceCard
                  service={svc}
                  showOwnerActions
                  busy={busyId === svc.id}
                  onEdit={() => openEdit(svc)}
                  onToggleActive={() => toggleActive(svc)}
                  priceFormatter={centsToVnd}
                />
              </>
            </Col>
          ))}
        </Row>
      )}

      {/* Editor */}
      <ServiceEditorModal
        show={showEditor}
        onHide={() => setShowEditor(false)}
        initial={editing}
        onSubmit={onSubmitEditor}
      />
    </div>
  );
}
