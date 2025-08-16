import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form as BootstrapForm } from "react-bootstrap";
import FormWrapper from "../../components/common/FormWrapper";

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
                        const res = await axiosClient.post(
                            "/auth/login",
                            values
                        );

                        const { token, user } = res.data;

                        if (!token || !user) {
                            toast.error("Invalid server response");
                            return;
                        }

                        login(user, token);
                        toast.success("Login successful!");

                        const target = redirectByRole(user.role);
                        navigate(target, { replace: true });
                    } catch (err) {
                        toast.error(
                            err.response?.data?.message ||
                                "Invalid email or password"
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
                                placeholder="Enter email"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger small"
                            />
                        </BootstrapForm.Group>

                        <BootstrapForm.Group className="mb-3">
                            <BootstrapForm.Label>Password</BootstrapForm.Label>
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
        </FormWrapper>
    );
}
