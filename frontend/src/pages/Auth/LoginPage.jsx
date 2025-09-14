// src/pages/Auth/LoginPage.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, Link, useLocation } from "react-router-dom"; // ⬅️ add useLocation
import { Button, Form as BootstrapForm } from "react-bootstrap";
import FormWrapper from "../../components/common/FormWrapper";
import { loginAsync } from "../../api/auth";

/** Yup validation schema for the login form */
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Prefill email if we were redirected from registration: navigate("/login", { state: { email } })
  const prefillEmail = location.state?.email || "";

  /** Map a role to its post-login landing route */
  const redirectByRole = (role) => {
    switch (role) {
      case "Admin":
        return "/admin";
      case "Driver":
        return "/driver";
      case "Company":
        return "/company";
      case "Rider":
      default:
        return "/";
    }
  };

  return (
    <FormWrapper
      title="Login"
      footer={
        <>
          <span>Don't have an account? </span>
          <Link to="/register">Register here</Link>
        </>
      }
    >
      <Formik
        initialValues={{ email: prefillEmail, password: "" }} // ⬅️ use prefilled email
        enableReinitialize // ⬅️ allow reinit if state changes
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const { token, profile } = await loginAsync(values);
            login(profile, token);
            toast.success("Login successful!");
            navigate(redirectByRole(profile.role), { replace: true });
          } catch (err) {
            toast.error(err.message || "Invalid credentials!");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* Email field */}
            <BootstrapForm.Group className="mb-3">
              <Field
                type="email"
                name="email"
                as={BootstrapForm.Control}
                placeholder="Enter email"
                autoFocus={!prefillEmail} // focus email only if not prefilled
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger small"
              />
            </BootstrapForm.Group>

            {/* Password field */}
            <BootstrapForm.Group className="mb-3">
              <Field
                type="password"
                name="password"
                as={BootstrapForm.Control}
                placeholder="Enter password"
                autoFocus={!!prefillEmail} // focus password if email is prefilled
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger small"
              />
            </BootstrapForm.Group>

            {/* Submit button */}
            <div className="d-grid">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
}
