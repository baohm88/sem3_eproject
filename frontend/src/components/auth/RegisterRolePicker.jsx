import { useState } from "react";
import { Button, Modal, ButtonGroup } from "react-bootstrap";
import RegisterFormRider from "./RegisterFormRider";
import RegisterFormCompany from "./RegisterFormCompany";
import RegisterFormDriver from "./RegisterFormDriver";

/**
 * Role picker for registration.
 *
 * UX flow:
 *  - User clicks one of the role buttons (Rider / Company / Driver).
 *  - We open a modal and render the corresponding registration form.
 *  - On successful registration, the child form calls `onDone`, which closes the modal.
 *
 * Notes:
 *  - The individual forms handle validation, signup, login, profile bootstrapping,
 *    and navigation after success.
 */
export default function RegisterRolePicker() {
  // Whether the modal is visible
  const [show, setShow] = useState(false);
  // The selected role whose form should be shown in the modal
  const [role, setRole] = useState(null);

  /** Open the modal for a specific role. */
  const open = (r) => {
    setRole(r);
    setShow(true);
  };

  /** Close the modal (child forms will call this via `onDone`). */
  const close = () => setShow(false);

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      <h4 className="mb-2">Choose a role to create your account</h4>

      {/* Role selector buttons */}
      <ButtonGroup className="mb-2" aria-label="Registration role selector">
        <Button variant="outline-primary" onClick={() => open("Rider")}>
          Register as Rider
        </Button>
        <Button variant="outline-success" onClick={() => open("Company")}>
          Register as Company
        </Button>
        <Button variant="outline-warning" onClick={() => open("Driver")}>
          Register as Driver
        </Button>
      </ButtonGroup>

      <p className="text-muted small mb-0">
        You will be signed in automatically after successful registration.
      </p>

      {/* Registration modal: renders the selected role's form */}
      <Modal show={show} onHide={close} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Register — {role || ""}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Render the appropriate registration form for the selected role */}
          {role === "Rider" && <RegisterFormRider onDone={close} />}
          {role === "Company" && <RegisterFormCompany onDone={close} />}
          {role === "Driver" && <RegisterFormDriver onDone={close} />}
        </Modal.Body>
      </Modal>
    </div>
  );
}
