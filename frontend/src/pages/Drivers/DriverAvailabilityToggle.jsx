import { Form } from "react-bootstrap";

export default function DriverAvailabilityToggle({ checked, onChange }) {
    return (
        <Form.Check
            type="switch"
            id="driver-available"
            label={checked ? "Available for jobs" : "Not available"}
            checked={!!checked}
            onChange={(e) => onChange?.(e.target.checked)}
        />
    );
}
