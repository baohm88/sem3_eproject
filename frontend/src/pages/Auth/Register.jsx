import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import authApi from "../../api/authApi";
import { toast } from "react-toastify";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Bắt buộc nhập email"),
  password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
    .required("Bắt buộc nhập xác nhận mật khẩu"),
  role: Yup.string().oneOf(["User", "Company", "Driver"]).required("Chọn vai trò"),
});

export default function Register() {
  return (
    <div className="form-container">
      <h2>Đăng ký</h2>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "", role: "User" }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const { confirmPassword, ...payload } = values;
            await authApi.Register(payload);
            toast.success("Đăng ký thành công! Hãy đăng nhập.");
            resetForm();
          } catch (err) {
            toast.error(err.response?.data?.error || "Đăng ký thất bại");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Email</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div>
              <label>Mật khẩu</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div>
              <label>Xác nhận mật khẩu</label>
              <Field type="password" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <div>
              <label>Vai trò</label>
              <Field as="select" name="role">
                <option value="User">Người dùng</option>
                <option value="Company">Công ty</option>
                <option value="Driver">Tài xế</option>
              </Field>
              <ErrorMessage name="role" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
