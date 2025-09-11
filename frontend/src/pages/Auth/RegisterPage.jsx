// src/pages/auth/RegisterPage.jsx
import RegisterRolePicker from "../../components/auth/RegisterRolePicker";
import FormWrapper from "../../components/common/FormWrapper";
import { Link } from "react-router-dom";

/**
 * RegisterPage
 * Minimal page that wraps the role picker inside a reusable FormWrapper.
 * Footer provides a link back to the Login page.
 */
export default function RegisterPage() {
  return (
    <FormWrapper
      title="Create an account"
      footer={
        <>
          <span>Already have an account? </span>
          <Link to="/login">Login here</Link>
        </>
      }
    >
      {/* Select a role to proceed with the appropriate registration flow */}
      <RegisterRolePicker />
    </FormWrapper>
  );
}
