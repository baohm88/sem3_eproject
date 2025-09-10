// src/components/auth/RegisterFormDriver.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form as BForm } from "react-bootstrap";
import { toast } from "react-toastify";
import { registerAsync, loginAsync } from "../../api/auth";
import { getMyDriverProfile, updateMyDriverProfile } from "../../api/drivers";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { cleanPayload } from "../../utils/cleanPayload";

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
      if (!val) return true; // allow empty
      try {
        new URL(val.startsWith("http") ? val : `https://${val}`);
        return true;
      } catch {
        return false;
      }
    }),
});

/**
 * Driver registration flow:
 * 1) Register auth account with role "Driver".
 * 2) Login to obtain token + profile and hydrate AuthContext.
 * 3) Ensure backend creates/returns driver profile (`getMyDriverProfile`).
 * 4) Update driver profile fields (uses `cleanPayload` to strip empties).
 * 5) Navigate to /driver dashboard.
 */
export default function RegisterFormDriver({ onDone }) {
  const { login } = useAuth();
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

          // Step 2: login and store session
          const { token, profile } = await loginAsync({
            email: payload.email,
            password: payload.password,
          });
          login(profile, token);

          // Step 3: make sure driver profile exists server-side
          await getMyDriverProfile();

          // Step 4: update driver profile (cleanPayload removes "", null, undefined)
          await updateMyDriverProfile(
            cleanPayload({
              fullName: payload.fullName,
              phone: payload.phone,
              skills: payload.skills,     // comma-separated or JSON string; parsed later by UI code if needed
              location: payload.location,
              imgUrl: payload.imgUrl,     // will be omitted if empty
            })
          );

          // Step 5: UX feedback + redirect
          toast.success("Registered & signed in!");
          resetForm();
          onDone?.();
          navigate("/driver", { replace: true });
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

          {/* Driver profile fields */}
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
