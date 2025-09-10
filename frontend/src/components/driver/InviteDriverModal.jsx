import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

/**
 * InviteDriverModal
 * Modal to invite a driver with a base salary (stored as cents) and optional expiry time.
 *
 * Props:
 * - show: boolean — controls visibility
 * - onHide?: () => void — close handler
 * - onSubmit?: (payload: { driverUserId: string, baseSalaryCents: number, expiresAt?: string }) => Promise<any> | void
 * - driver?: { userId?: string, fullName?: string }
 *
 * Notes:
 * - We keep salary in cents internally to avoid float rounding issues.
 * - The input displays whole currency units (VND) and converts to cents on change.
 */
export default function InviteDriverModal({ show, onHide, onSubmit, driver }) {
  // Base salary in cents for precision (displayed as units ÷ 100)
  const [baseSalaryCents, setBaseSalaryCents] = useState(0);
  const [expiresAt, setExpiresAt] = useState("");

  // Reset all form fields to initial state
  const reset = () => {
    setBaseSalaryCents(0);
    setExpiresAt("");
  };

  // Close and reset
  const handleClose = () => {
    reset();
    onHide?.();
  };

  // Validate and submit the payload
  const handleSubmit = async () => {
    // Guard: require a valid driver id
    if (!driver?.userId) {
      // You can replace with toast if desired
      return;
    }

    await onSubmit?.({
      driverUserId: driver?.userId,
      baseSalaryCents: Number(baseSalaryCents) || 0, // ensure number
      expiresAt: expiresAt || undefined,             // omit if empty
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
          {/* Base salary input (display as VND units; convert to cents internally) */}
          <Form.Group className="mb-3">
            <Form.Label>Base salary (VND)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              step={1000}
              value={Math.round((baseSalaryCents || 0) / 100)}
              onChange={(e) =>
                setBaseSalaryCents(Number(e.target.value || 0) * 100)
              }
              placeholder="e.g. 5,000,000"
            />
            <Form.Text className="text-muted">
              Stored in the system as <code>cents</code> for precision.
            </Form.Text>
          </Form.Group>

          {/* Optional expiry datetime (local) */}
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
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Send invite
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
