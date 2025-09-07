// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { registerAsync } from "../../api/auth.ts";
// import { toast } from "react-toastify";
// import { useNavigate, Link } from "react-router-dom";
// import { Button, Form as BootstrapForm } from "react-bootstrap";
// import FormWrapper from "../../components/common/FormWrapper";

// const RegisterSchema = Yup.object().shape({
//     email: Yup.string()
//         .email("Invalid email address.")
//         .required("Email is required."),
//     password: Yup.string()
//         .min(6, "Password must be at least 6 characters long.")
//         .required("Password is required."),
//     confirmPassword: Yup.string()
//         .oneOf([Yup.ref("password"), null], "Passwords must match.")
//         .required("Confirm Password is required."),
//     role: Yup.string()
//         .oneOf(["Rider", "Company", "Driver"])
//         .required("Role is required."),
// });

// export default function RegisterPage() {
//     const navigate = useNavigate();

//     return (
//         <FormWrapper
//             title="Create an account"
//             footer={
//                 <>
//                     <span>Already have an account? </span>
//                     <Link to="/login">Login here</Link>
//                 </>
//             }
//         >
//             <Formik
//                 initialValues={{
//                     email: "",
//                     password: "",
//                     confirmPassword: "",
//                     role: "Rider",
//                 }}
//                 validationSchema={RegisterSchema}
//                 onSubmit={async (values, { setSubmitting, resetForm }) => {
//                     try {
//                         const { confirmPassword, ...payload } = values;
//                         const res = await registerAsync(payload);

//                         toast.success(
//                             res.message || "Registration successful!"
//                         );
//                         resetForm();
//                         navigate("/login");
//                     } catch (err) {
//                         toast.error(
//                             err.response?.data?.message || "Registration failed"
//                         );
//                     } finally {
//                         setSubmitting(false);
//                     }
//                 }}
//             >
//                 {({ isSubmitting }) => (
//                     <Form>
//                         {/* Email */}
//                         <BootstrapForm.Group className="mb-3">
//                             {/* <BootstrapForm.Label>Email</BootstrapForm.Label> */}
//                             <Field
//                                 type="email"
//                                 name="email"
//                                 as={BootstrapForm.Control}
//                                 placeholder="Enter email"
//                             />
//                             <ErrorMessage
//                                 name="email"
//                                 component="div"
//                                 className="text-danger small"
//                             />
//                         </BootstrapForm.Group>

//                         {/* Password */}
//                         <BootstrapForm.Group className="mb-3">
//                             {/* <BootstrapForm.Label>Password</BootstrapForm.Label> */}
//                             <Field
//                                 type="password"
//                                 name="password"
//                                 as={BootstrapForm.Control}
//                                 placeholder="Enter password"
//                             />
//                             <ErrorMessage
//                                 name="password"
//                                 component="div"
//                                 className="text-danger small"
//                             />
//                         </BootstrapForm.Group>

//                         {/* Confirm Password */}
//                         <BootstrapForm.Group className="mb-3">
//                             {/* <BootstrapForm.Label>
//                                 Confirm Password
//                             </BootstrapForm.Label> */}
//                             <Field
//                                 type="password"
//                                 name="confirmPassword"
//                                 as={BootstrapForm.Control}
//                                 placeholder="Confirm password"
//                             />
//                             <ErrorMessage
//                                 name="confirmPassword"
//                                 component="div"
//                                 className="text-danger small"
//                             />
//                         </BootstrapForm.Group>

//                         {/* Role */}
//                         <BootstrapForm.Group className="mb-3">
//                             {/* <BootstrapForm.Label>Role</BootstrapForm.Label> */}
//                             <Field
//                                 as="select"
//                                 name="role"
//                                 className="form-select"
//                             >
//                                 <option value="Rider">Rider</option>
//                                 <option value="Company">Company</option>
//                                 <option value="Driver">Driver</option>
//                             </Field>
//                             <ErrorMessage
//                                 name="role"
//                                 component="div"
//                                 className="text-danger small"
//                             />
//                         </BootstrapForm.Group>

//                         <div className="d-grid">
//                             <Button
//                                 type="submit"
//                                 variant="primary"
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? "Registering..." : "Register"}
//                             </Button>
//                         </div>
//                     </Form>
//                 )}
//             </Formik>
//         </FormWrapper>
//     );
// }
// https://www.google.com/url?sa=i&url=https%3A%2F%2Fpk.ign.com%2Favatar-generations&psig=AOvVaw1duyGsWzPIcf_m6V3NN6oY&ust=1756699367019000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKCMqKCVtI8DFQAAAAAdAAAAABAE
import RegisterRolePicker from "../../components/auth/RegisterRolePicker";
import FormWrapper from "../../components/common/FormWrapper";
import { Link } from "react-router-dom";

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
            <RegisterRolePicker />
        </FormWrapper>
    );
}
