// src/components/company/EditProfileModal.jsx
import { useEffect, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

function cleanPayload(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (v === "" || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

export default function EditProfileModal({ show, onHide, initial, onSave }) {
  const [form, setForm] = useState({ name: "", description: "", imgUrl: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name ?? "",
        description: initial.description ?? "",
        imgUrl: initial.imgUrl ?? "",
      });
    } else {
      setForm({ name: "", description: "", imgUrl: "" });
    }
  }, [initial, show]);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      if (!form.name?.trim()) {
        toast.error("Name is required");
        return;
      }
      setSaving(true);
      await onSave?.(cleanPayload(form));
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
