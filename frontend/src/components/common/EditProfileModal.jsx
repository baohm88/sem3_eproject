import { useEffect, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";

export default function EditProfileModal({
  show,
  onHide,
  initial,
  fields = [],
  onSave,
  title = "Edit Profile",
  children,           // <— NEW: nội dung thêm trong Body
  scrollable = true,  // optional
}) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) setForm({ ...initial });
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
      await onSave?.(cleanPayload(form));
      onHide?.();
    } catch (e) {
      // để page parent toast lỗi
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered scrollable={scrollable}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {fields.map((f) => (
            <Form.Group key={f.name} className="mb-3">
              {f.label && <Form.Label>{f.label}</Form.Label>}
              <Form.Control
                name={f.name}
                value={form[f.name] ?? ""}
                onChange={handleChange}
                placeholder={f.placeholder}
                as={f.as}
                rows={f.rows}
                type={f.type || "text"}
              />
              {f.helpText && (
                <Form.Text muted>{f.helpText}</Form.Text>
              )}
            </Form.Group>
          ))}

          {/* Nội dung custom (VD: Skills/TagInput) */}
          {children}
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
