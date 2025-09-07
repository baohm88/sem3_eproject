
import { useState } from "react";
import { Button, Modal, ButtonGroup } from "react-bootstrap";
import RegisterFormRider from "./RegisterFormRider";
import RegisterFormCompany from "./RegisterFormCompany";
import RegisterFormDriver from "./RegisterFormDriver";

export default function RegisterRolePicker() {
  const [show, setShow] = useState(false);
  const [role, setRole] = useState(null);

  const open = (r) => { setRole(r); setShow(true); };
  const close = () => setShow(false);

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      <h4 className="mb-2">Choose a role to create your account</h4>
      <ButtonGroup className="mb-2">
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

      <Modal show={show} onHide={close} centered>
        <Modal.Header closeButton>
          <Modal.Title>Register — {role}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {role === "Rider" && <RegisterFormRider onDone={close} />}
          {role === "Company" && <RegisterFormCompany onDone={close} />}
          {role === "Driver" && <RegisterFormDriver onDone={close} />}
        </Modal.Body>
      </Modal>
    </div>
  );
}
