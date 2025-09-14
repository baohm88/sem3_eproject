// src/components/auth/RegisterFormCompany.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form as BForm } from "react-bootstrap";
import { toast } from "react-toastify";
import { registerAsync } from "../../api/auth";       // ⬅️ only register now
import { useNavigate } from "react-router-dom";

const Schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min 6 chars").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  name: Yup.string().required("Required"),
  description: Yup.string().nullable(),
  imgUrl: Yup.string()
    .trim()
    .nullable()
    .test("optional-url", "Must be a valid URL", (val) => {
      if (!val) return true;
      try {
        new URL(val.startsWith("http") ? val : `https://${val}`);
        return true;
      } catch {
        return false;
      }
    }),
});

export default function RegisterFormCompany({ onDone }) {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        description: "",
        imgUrl: "",
      }}
      validationSchema={Schema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const { confirmPassword, ...payload } = values;

          // Step 1: register account with Company role
          await registerAsync({
            email: payload.email,
            password: payload.password,
            role: "Company",
          });

          // ⬇️ No auto-login & no company profile update here.
          // Tell user to check OTP in server console, then go to login.
          toast.success("Registered! Please log in.");
          resetForm();
          onDone?.();

          // Prefill email on the login screen (optional)
          navigate("/login", { replace: true, state: { email: payload.email } });
        } catch (err) {
          toast.error(err.message || "Registration failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          {/* Auth fields */}
          <BForm.Group className="mb-3">
            <Field type="email" name="email" as={BForm.Control} placeholder="Email" />
            <ErrorMessage name="email" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field type="password" name="password" as={BForm.Control} placeholder="Password" />
            <ErrorMessage name="password" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field type="password" name="confirmPassword" as={BForm.Control} placeholder="Confirm password" />
            <ErrorMessage name="confirmPassword" component="div" className="text-danger small" />
          </BForm.Group>

          <hr className="my-3" />

          {/* Company profile fields (collect now; update after login) */}
          <BForm.Group className="mb-3">
            <Field name="name" as={BForm.Control} placeholder="Company name" />
            <ErrorMessage name="name" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field name="description" as={BForm.Control} placeholder="Description (optional)" />
            <ErrorMessage name="description" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field name="imgUrl" as={BForm.Control} placeholder="Logo URL (optional)" />
            <ErrorMessage name="imgUrl" component="div" className="text-danger small" />
          </BForm.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
