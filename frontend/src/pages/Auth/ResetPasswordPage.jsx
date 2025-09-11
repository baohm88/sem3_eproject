// src/pages/Auth/ResetPasswordPage.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Form as BootstrapForm } from "react-bootstrap";
import AuthLayout from "../../components/layout/AuthLayout";

/** Yup schema: basic strength + match validation */
const ResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required."),
});

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams(); // get reset token from URL

  return (
    <AuthLayout
      title="Reset Password"
      footer={
        <>
          <span>Back to </span>
          <Link to="/login">Login</Link>
        </>
      }
    >
      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={ResetPasswordSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            // Do not send confirmPassword to API; only send the new password payload
            const { confirmPassword, ...payload } = values;
            const res = await axiosClient.post(
              `/auth/reset-password/${token}`,
              payload
            );

            toast.success(res.message || "Password reset successfully!");
            resetForm();
            navigate("/login");
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Failed to reset password"
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* New Password */}
            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>New Password</BootstrapForm.Label>
              <Field
                type="password"
                name="newPassword"
                as={BootstrapForm.Control}
                placeholder="Enter new password"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-danger small"
              />
            </BootstrapForm.Group>

            {/* Confirm Password */}
            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>Confirm Password</BootstrapForm.Label>
              <Field
                type="password"
                name="confirmPassword"
                as={BootstrapForm.Control}
                placeholder="Confirm new password"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-danger small"
              />
            </BootstrapForm.Group>

            {/* Submit */}
            <div className="d-grid">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
}
