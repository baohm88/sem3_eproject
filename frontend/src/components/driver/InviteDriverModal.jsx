import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function InviteDriverModal({ show, onHide, onSubmit, driver }) {
  const [baseSalaryCents, setBaseSalaryCents] = useState(0);
  const [expiresAt, setExpiresAt] = useState("");

  const reset = () => {
    setBaseSalaryCents(0);
    setExpiresAt("");
  };

  const handleClose = () => {
    reset();
    onHide?.();
  };

  const handleSubmit = async () => {
    await onSubmit?.({
      driverUserId: driver?.userId,
      baseSalaryCents: Number(baseSalaryCents) || 0,
      expiresAt: expiresAt || undefined,
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Invite {driver?.fullName || "driver"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Base salary (VND)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              step={1000}
              value={Math.round((baseSalaryCents || 0) / 100)}
              onChange={(e) => setBaseSalaryCents(Number(e.target.value || 0) * 100)}
              placeholder="Ví dụ: 5,000,000"
            />
            <Form.Text className="text-muted">
              Lưu trong hệ thống ở 단 vị <code>cents</code>.
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Expires at (optional)</Form.Label>
            <Form.Control
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Send invite</Button>
      </Modal.Footer>
    </Modal>
  );
}
