// src/components/common/ConfirmModal.jsx
import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

/**
 * Generic confirmation modal.
 *
 * Props:
 * - show: boolean — whether the modal is visible
 * - onHide: () => void — called to close the modal
 * - title?: string — modal title (default: "Confirm")
 * - message?: string | ReactNode — body content (default: "Are you sure?")
 * - confirmText?: string — confirm button label (default: "Confirm")
 * - cancelText?: string — cancel button label (default: "Cancel")
 * - variant?: string — bootstrap variant for confirm button (default: "primary")
 * - onConfirm?: () => (void | Promise<void>) — async/sync confirm handler.
 *      If it returns a Promise, the modal shows a spinner until resolved.
 *      On success, the modal auto-closes by calling `onHide`.
 * - disabled?: boolean — disables the confirm button (e.g., when prerequisites unmet)
 * - footerExtra?: ReactNode — optional left-aligned content in footer
 *      (e.g., a checkbox, a small note, etc.)
 */
export default function ConfirmModal({
  show,
  onHide,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  onConfirm,
  disabled = false,
  footerExtra, // optional ReactNode (e.g., checkbox, hint)
}) {
  const [loading, setLoading] = useState(false); // tracks async confirm in-flight

  const handleConfirm = async () => {
    // If no confirm handler, just close the modal
    if (!onConfirm) return onHide?.();
    try {
      setLoading(true);
      await onConfirm(); // supports both sync and async handlers
      onHide?.();        // auto-close on success
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      {/* Header */}
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}

      {/* Body: accept string or custom ReactNode */}
      <Modal.Body>
        {typeof message === "string" ? <p className="mb-0">{message}</p> : message}
      </Modal.Body>

      {/* Footer: left side = extra content; right side = actions */}
      <Modal.Footer className="d-flex w-100 justify-content-between">
        <div>{footerExtra}</div>

        <div className="d-flex gap-2">
          {/* Cancel button remains enabled even while loading, to allow user to dismiss */}
          <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
            {cancelText}
          </Button>

          {/* Confirm button shows spinner when `onConfirm` is pending */}
          <Button variant={variant} onClick={handleConfirm} disabled={loading || disabled}>
            {loading ? <Spinner size="sm" /> : confirmText}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
