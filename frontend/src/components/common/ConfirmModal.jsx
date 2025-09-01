import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

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
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return onHide?.();
    try {
      setLoading(true);
      await onConfirm();
      onHide?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {typeof message === "string" ? <p className="mb-0">{message}</p> : message}
      </Modal.Body>
      <Modal.Footer className="d-flex w-100 justify-content-between">
        <div>{footerExtra}</div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm} disabled={loading || disabled}>
            {loading ? <Spinner size="sm" /> : confirmText}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
