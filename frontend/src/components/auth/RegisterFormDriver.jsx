// src/components/auth/RegisterFormDriver.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form as BForm } from "react-bootstrap";
import { toast } from "react-toastify";
import { registerAsync } from "../../api/auth";   // ⬅️ only register now
import { useNavigate } from "react-router-dom";

/**
 * Validation schema:
 * - `imgUrl` is optional; if provided it must be a valid URL.
 * - `confirmPassword` must match `password`.
 */
const Schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min 6 chars").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  fullName: Yup.string().required("Required"),
  phone: Yup.string().nullable(),
  skills: Yup.string().nullable(),
  location: Yup.string().nullable(),
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

/**
 * Driver registration flow (OTP mock):
 * 1) Register auth account with role "Driver".
 * 2) Show success + tell user to check OTP in server console.
 * 3) Redirect to /login (prefill email).
 * 4) After login, you can create/update the driver profile.
 */
export default function RegisterFormDriver({ onDone }) {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phone: "",
        skills: "",
        location: "",
        imgUrl: "",
      }}
      validationSchema={Schema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const { confirmPassword, ...payload } = values;

          // Step 1: register with Driver role
          await registerAsync({
            email: payload.email,
            password: payload.password,
            role: "Driver",
          });

          // Step 2–3: success message + redirect to login
          toast.success("Registered! Please log in.");
          resetForm();
          onDone?.();
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
            <Field
              type="password"
              name="confirmPassword"
              as={BForm.Control}
              placeholder="Confirm password"
            />
            <ErrorMessage name="confirmPassword" component="div" className="text-danger small" />
          </BForm.Group>

          <hr className="my-3" />

          {/* Driver profile fields (collected now; update after login) */}
          <BForm.Group className="mb-3">
            <Field name="fullName" as={BForm.Control} placeholder="Full name" />
            <ErrorMessage name="fullName" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field name="phone" as={BForm.Control} placeholder="Phone (optional)" />
            <ErrorMessage name="phone" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field name="skills" as={BForm.Control} placeholder="Skills (comma separated)" />
            <ErrorMessage name="skills" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field name="location" as={BForm.Control} placeholder="Location (optional)" />
            <ErrorMessage name="location" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field name="imgUrl" as={BForm.Control} placeholder="Avatar URL (optional)" />
            <ErrorMessage name="imgUrl" component="div" className="text-danger small" />
          </BForm.Group>

          {/* Submit */}
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
