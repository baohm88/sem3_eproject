import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button, Form as BootstrapForm } from "react-bootstrap";
import AuthLayout from "../../components/layout/AuthLayout";

const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address.")
        .required("Email is required."),
});

export default function ForgotPasswordPage() {
    return (
        <AuthLayout
            title="Forgot Password"
            footer={
                <>
                    <span>Remember your password? </span>
                    <Link to="/login">Back to Login</Link>
                </>
            }
        >
            <Formik
                initialValues={{ email: "" }}
                validationSchema={ForgotPasswordSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        // Gọi API backend gửi email reset
                        const res = await axiosClient.post(
                            "/auth/forgot-password",
                            values
                        );
                        toast.success(
                            res.message ||
                                "Password reset link sent to your email."
                        );
                        resetForm();
                    } catch (err) {
                        toast.error(
                            err.response?.data?.message ||
                                "Failed to send reset link"
                        );
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label>Email</BootstrapForm.Label>
                            <Field
                                type="email"
                                name="email"
                                as={BootstrapForm.Control}
                                placeholder="Enter your email"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger small"
                            />
                        </BootstrapForm.Group>

                        <div className="d-grid">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Sending..."
                                    : "Send Reset Link"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </AuthLayout>
    );
}
