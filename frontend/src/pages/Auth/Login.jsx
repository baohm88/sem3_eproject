import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Bắt buộc nhập email"),
  password: Yup.string()
    .min(6, "Tối thiểu 6 ký tự")
    .required("Bắt buộc nhập mật khẩu"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <h2>Đăng nhập</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await axiosClient.post("/auth/login", values);
            console.log(res);

            // { success, message, data: { token, user } }
            const { token, user } = res.data;

            if (!token || !user) {
              toast.error("Dữ liệu trả về từ server không hợp lệ");
              return;
            }

            login(user, token);
            toast.success("Đăng nhập thành công!");
            navigate("/");
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Sai email hoặc mật khẩu"
            );
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

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
