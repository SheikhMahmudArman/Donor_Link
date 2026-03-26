import { useState } from "react";

import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        emailOrPhone: form.emailOrPhone,
        password: form.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token); 
    navigate("/homepage");

  } catch (err) {
    setError("Something went wrong");
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-card" onSubmit={handleSubmit}>
          <h1>Welcome Back</h1>
          <p className="subtitle">
            Sign in to continue connecting and saving lives
          </p>

          {error && <p className="error-text">{error}</p>}

          <div className="form-group">
            <label>Email or Phone</label>
            <input
              type="text"
              name="emailOrPhone"
              value={form.emailOrPhone}
              onChange={handleChange}
              placeholder="Enter your email or phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>

          <p className="register-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Register now</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;