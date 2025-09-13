// src/pages/Auth/LoginPage.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form as BootstrapForm } from "react-bootstrap";
import { loginAsync } from "../../api/auth";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too short").required("Required"),
});

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

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
        <>
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const { token, profile } = await loginAsync(values);
                        login(profile, token);
                        toast.success("Login successful!");
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

                        <div className="d-grid">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
            
            <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <Link to="/register">Register here</Link>
            </div>
        </>
    );
}
