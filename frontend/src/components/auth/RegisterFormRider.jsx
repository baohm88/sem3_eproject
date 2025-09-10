// // src/components/auth/RegisterFormRider.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form as BForm } from "react-bootstrap";
import { toast } from "react-toastify";
import { registerAsync, loginAsync } from "../../api/auth";
import { getMyRider, updateMyRider } from "../../api/riders";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { cleanPayload } from "../../utils/cleanPayload";

/**
 * Validation schema:
 * - `imgUrl` is optional; if provided it must be a valid URL (http/https assumed if missing).
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
 * Rider registration flow:
 * 1) Register account with role "Rider".
 * 2) Login to obtain token + profile and hydrate AuthContext.
 * 3) Ensure backend rider resource exists (`getMyRider`).
 * 4) Update rider profile (uses `cleanPayload` to drop empty fields).
 * 5) Navigate to home page.
 */
export default function RegisterFormRider({ onDone }) {
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
        imgUrl: "",
      }}
      validationSchema={Schema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const { confirmPassword, ...payload } = values;

          // Step 1: create auth account with Rider role
          await registerAsync({
            email: payload.email,
            password: payload.password,
            role: "Rider",
          });

          // Step 2: login and store session in context
          const { token, profile } = await loginAsync({
            email: payload.email,
            password: payload.password,
          });
          login(profile, token);

          // Step 3: ensure rider profile exists server-side
          await getMyRider();

          // Step 4: update rider profile (cleanPayload removes "", null, undefined)
          const res2 = await updateMyRider(
            cleanPayload({
              fullName: payload.fullName,
              phone: payload.phone,
              imgUrl: payload.imgUrl,
            })
          );
          // Useful during development; consider removing in production:
          console.log("update rider res: ", res2);

          // Step 5: UX feedback + redirect
          toast.success("Registered & signed in!");
          resetForm();
          onDone?.();
          navigate("/", { replace: true });
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

          {/* Rider profile fields */}
          <BForm.Group className="mb-3">
            <Field name="fullName" as={BForm.Control} placeholder="Full name" />
            <ErrorMessage name="fullName" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field name="phone" as={BForm.Control} placeholder="Phone (optional)" />
            <ErrorMessage name="phone" component="div" className="text-danger small" />
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
