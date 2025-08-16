// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axiosClient from "../../api/axiosClient";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const RegisterSchema = Yup.object().shape({
//     email: Yup.string()
//         .email("Invalid email address.")
//         .required("Email is required."),
//     password: Yup.string()
//         .min(6, "Password must be at least 6 characters long.")
//         .required("Password is required."),
//     confirmPassword: Yup.string()
//         .oneOf(
//             [Yup.ref("password"), null],
//             "Password and Confirm Password must match."
//         )
//         .required("Confirm Password is required."),
//     role: Yup.string()
//         .oneOf(["User", "Company", "Driver"])
//         .required("Role is required."),
// });

// export default function RegisterPage() {
//     const navigate = useNavigate();

//     return (
//         <div className="form-container">
//             <h2>Đăng ký</h2>
//             <Formik
//                 initialValues={{
//                     email: "",
//                     password: "",
//                     confirmPassword: "",
//                     role: "User",
//                 }}
//                 validationSchema={RegisterSchema}
//                 onSubmit={async (values, { setSubmitting, resetForm }) => {
//                     try {
//                         const { confirmPassword, ...payload } = values;
//                         const res = await axiosClient.post(
//                             "/auth/register",
//                             payload
//                         );
//                         console.log(res);

//                         toast.success(
//                             res.message || "Đăng ký thành công! Hãy đăng nhập."
//                         );
//                         resetForm();
//                         navigate("/login");
//                     } catch (err) {
//                         toast.error(
//                             err.response?.data?.message || "Đăng ký thất bại"
//                         );
//                     } finally {
//                         setSubmitting(false);
//                     }
//                 }}
//             >
//                 {({ isSubmitting }) => (
//                     <Form>
//                         <div>
//                             <label>Email: </label>
//                             <Field type="email" name="email" />
//                             <ErrorMessage
//                                 name="email"
//                                 component="div"
//                                 className="error"
//                             />
//                         </div>

//                         <div>
//                             <label>Password: </label>
//                             <Field type="password" name="password" />
//                             <ErrorMessage
//                                 name="password"
//                                 component="div"
//                                 className="error"
//                             />
//                         </div>

//                         <div>
//                             <label>Confirm Password: </label>
//                             <Field type="password" name="confirmPassword" />
//                             <ErrorMessage
//                                 name="confirmPassword"
//                                 component="div"
//                                 className="error"
//                             />
//                         </div>

//                         <div>
//                             <label>You're: </label>
//                             <Field as="select" name="role">
//                                 <option value="User">User</option>
//                                 <option value="Company">Company</option>
//                                 <option value="Driver">Driver</option>
//                             </Field>
//                             <ErrorMessage
//                                 name="role"
//                                 component="div"
//                                 className="error"
//                             />
//                         </div>

//                         <button type="submit" disabled={isSubmitting}>
//                             {isSubmitting ? "Submitting..." : "Submit"}
//                         </button>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     );
// }

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form as BootstrapForm,
} from "react-bootstrap";

const RegisterSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address.")
        .required("Email is required."),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters long.")
        .required("Password is required."),
    confirmPassword: Yup.string()
        .oneOf(
            [Yup.ref("password"), null],
            "Password and Confirm Password must match."
        )
        .required("Confirm Password is required."),
    role: Yup.string()
        .oneOf(["User", "Company", "Driver"])
        .required("Role is required."),
});

export default function RegisterPage() {
    const navigate = useNavigate();

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Row className="w-100">
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="shadow-lg p-4 rounded-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">
                                Create an Account
                            </h2>
                            <Formik
                                initialValues={{
                                    email: "",
                                    password: "",
                                    confirmPassword: "",
                                    role: "User",
                                }}
                                validationSchema={RegisterSchema}
                                onSubmit={async (
                                    values,
                                    { setSubmitting, resetForm }
                                ) => {
                                    try {
                                        const { confirmPassword, ...payload } =
                                            values;
                                        const res = await axiosClient.post(
                                            "/auth/register",
                                            payload
                                        );
                                        console.log(res);

                                        toast.success(
                                            res.message ||
                                                "Registration successful! Please login."
                                        );
                                        resetForm();
                                        navigate("/login");
                                    } catch (err) {
                                        toast.error(
                                            err.response?.data?.message ||
                                                "Registration failed"
                                        );
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        {/* Email */}
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>
                                                Email
                                            </BootstrapForm.Label>
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

                                        {/* Password */}
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>
                                                Password
                                            </BootstrapForm.Label>
                                            <Field
                                                type="password"
                                                name="password"
                                                as={BootstrapForm.Control}
                                                placeholder="Enter your password"
                                            />
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-danger small"
                                            />
                                        </BootstrapForm.Group>

                                        {/* Confirm Password */}
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>
                                                Confirm Password
                                            </BootstrapForm.Label>
                                            <Field
                                                type="password"
                                                name="confirmPassword"
                                                as={BootstrapForm.Control}
                                                placeholder="Confirm your password"
                                            />
                                            <ErrorMessage
                                                name="confirmPassword"
                                                component="div"
                                                className="text-danger small"
                                            />
                                        </BootstrapForm.Group>

                                        {/* Role */}
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>
                                                You are
                                            </BootstrapForm.Label>
                                            <Field
                                                name="role"
                                                as={BootstrapForm.Select}
                                            >
                                                <option value="User">
                                                    User
                                                </option>
                                                <option value="Company">
                                                    Company
                                                </option>
                                                <option value="Driver">
                                                    Driver
                                                </option>
                                            </Field>
                                            <ErrorMessage
                                                name="role"
                                                component="div"
                                                className="text-danger small"
                                            />
                                        </BootstrapForm.Group>

                                        {/* Submit Button */}
                                        <div className="d-grid">
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                disabled={isSubmitting}
                                                className="rounded-3"
                                            >
                                                {isSubmitting
                                                    ? "Registering..."
                                                    : "Register"}
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>

                            {/* Link to Login */}
                            <div className="text-center mt-3">
                                <span>Already have an account? </span>
                                <Link to="/login">Login here</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
