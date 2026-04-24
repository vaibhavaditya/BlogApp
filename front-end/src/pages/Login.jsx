import { useState } from "react";
import { loginUser } from "../api/userApi";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await loginUser(form);
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}

export default Login;