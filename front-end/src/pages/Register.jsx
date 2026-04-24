import { useState } from "react";
import { registerUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null, // ✅ file
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, avatar: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);

      if (form.avatar) {
        formData.append("avatar", form.avatar); // ✅ must match multer
      }

      await registerUser(formData);

      navigate("/login");
    } catch (err) {
      console.error("Register error", err);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        name="fullName"
        placeholder="Full Name"
        onChange={handleChange}
      />

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      {/* ✅ Avatar Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* ✅ Preview (optional but useful) */}
      {form.avatar && (
        <img
          src={URL.createObjectURL(form.avatar)}
          alt="preview"
          width="100"
        />
      )}

      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}

export default Register;