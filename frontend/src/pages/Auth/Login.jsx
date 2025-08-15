import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../api/authApi";
import { toast } from "react-toastify";

export default function LoginPage() {
  // const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const res = await loginApi(form); // { token, user }
    //   login(res.user, res.token);
    //   toast.success("Đăng nhập thành công!");
    // } catch (err) {
    //   toast.error("Sai email hoặc mật khẩu");
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
