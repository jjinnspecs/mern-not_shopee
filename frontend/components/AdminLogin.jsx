import { useState } from "react";
import { useAuthStore } from "../src/store/auth";


const AdminLogin = () => {
    const loginAdmin = useAuthStore((state) => state.loginAdmin);

  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const data = await loginAdmin(form.username, form.password);
    if (data.success) {
      setMessage("Login successful!");
      // redirect or update UI as needed
    } else {
      setMessage(data.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
      <button type="submit">Login</button>
      <div>{message}</div>
    </form>
  );
};

export default AdminLogin;