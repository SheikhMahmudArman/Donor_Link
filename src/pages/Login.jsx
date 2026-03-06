import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your actual login logic here later
    navigate("/homepage"); // redirect to homepage after successful login
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-card" onSubmit={handleSubmit}>
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to continue connecting and saving lives</p>

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