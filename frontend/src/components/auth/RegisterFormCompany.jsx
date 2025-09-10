import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Form as BForm } from "react-bootstrap";
import { toast } from "react-toastify";
import { registerAsync, loginAsync } from "../../api/auth";
import { getMyCompany, updateMyCompany } from "../../api/companies";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { cleanPayload } from "../../utils/cleanPayload";

/**
 * Validation schema:
 * - `imgUrl` is optional; if present it must be a valid URL (http/https is assumed if omitted).
 */
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
 * Company registration form:
 * 1) Create account with role "Company"
 * 2) Log the user in and store session via AuthContext
 * 3) Ensure company record exists (getMyCompany)
 * 4) Update company profile (name/description/imgUrl)
 * 5) Redirect to company dashboard
 */
export default function RegisterFormCompany({ onDone }) {
  const { login } = useAuth();
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

          // Step 1: register an auth account with Company role
          await registerAsync({
            email: payload.email,
            password: payload.password,
            role: "Company",
          });

          // Step 2: login to obtain token + profile, then hydrate auth context
          const { token, profile } = await loginAsync({
            email: payload.email,
            password: payload.password,
          });
          login(profile, token);

          // Step 3: make sure the backend creates/returns the company owned by this user
          await getMyCompany();

          // Step 4: update company profile fields (cleanPayload strips empty strings/nulls)
          await updateMyCompany(
            cleanPayload({
              name: payload.name,
              description: payload.description,
              imgUrl: payload.imgUrl,
            })
          );

          // Step 5: UX feedback + redirect
          toast.success("Registered & signed in!");
          resetForm();
          onDone?.();
          navigate("/company", { replace: true });
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
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-danger small"
            />
          </BForm.Group>

          <hr className="my-3" />

          {/* Company profile fields */}
          <BForm.Group className="mb-3">
            <Field name="name" as={BForm.Control} placeholder="Company name" />
            <ErrorMessage name="name" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field
              name="description"
              as={BForm.Control}
              placeholder="Description (optional)"
            />
            <ErrorMessage name="description" component="div" className="text-danger small" />
          </BForm.Group>
          <BForm.Group className="mb-3">
            <Field name="imgUrl" as={BForm.Control} placeholder="Logo URL (optional)" />
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
