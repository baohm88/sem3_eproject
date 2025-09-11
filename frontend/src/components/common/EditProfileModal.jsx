// src/components/common/EditProfileModal.jsx
import { useEffect, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

/**
 * EditProfileModal
 *
 * Generic, schema-less profile editor modal.
 *
 * Props:
 * - show: boolean — whether the modal is visible.
 * - onHide: () => void — called to close the modal.
 * - initial?: Record<string, any> — initial field values.
 * - fields?: Array<{
 *     name: string;
 *     label?: string;
 *     placeholder?: string;
 *     as?: any;           // e.g., "textarea"
 *     rows?: number;      // textarea rows
 *     type?: string;      // input type (text, email, url, etc.)
 *     helpText?: string;  // small muted helper text
 *   }>
 * - onSave?: (payload: Record<string, any>) => (void | Promise<void>)
 *     Called with a cleaned payload (empty strings & undefined removed).
 *     If it returns a Promise, a spinner is shown until resolved.
 * - title?: string — modal title (default: "Edit Profile").
 * - children?: ReactNode — extra custom content rendered inside the <Form> body
 *     (e.g., a Skills/TagInput component).
 * - scrollable?: boolean — enable Bootstrap's scrollable modal body (default: true).
 */
export default function EditProfileModal({
  show,
  onHide,
  initial,
  fields = [],
  onSave,
  title = "Edit Profile",
  children, 
  scrollable = true, 
}) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Hydrate form state whenever `initial` changes
  useEffect(() => {
    if (initial) setForm({ ...initial });
  }, [initial]);

  // Controlled inputs handler
  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // Remove empty strings and undefined; keep nulls as-is (caller decides)
  const cleanPayload = (obj) => {
    const out = {};
    for (const [k, v] of Object.entries(obj || {})) {
      if (v === "" || v === undefined) continue;
      out[k] = v;
    }
    return out;
  };

  // Save handler: show spinner during async, let parent handle toasts on error
  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave?.(cleanPayload(form));
      onHide?.();
    } catch (e) {
      toast.error(e?.message)
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
              {f.helpText && <Form.Text muted>{f.helpText}</Form.Text>}
            </Form.Group>
          ))}

          {/* Custom body content (e.g., Skills/TagInput, preview, etc.) */}
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
