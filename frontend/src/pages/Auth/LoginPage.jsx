// src/pages/Auth/LoginPage.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
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
        return "/";
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
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // Call API -> get token + profile, then persist via AuthContext
            const { token, profile } = await loginAsync(values);
            login(profile, token);
            toast.success("Login successful!");
            // Redirect based on role
            const target = redirectByRole(profile.role);
            navigate(target, { replace: true });
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
