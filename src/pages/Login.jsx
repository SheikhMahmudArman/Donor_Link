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
    // Login successful, navigate to homepage
    navigate("/Homepage");  // <-- homepage route
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="text"
          name="emailOrPhone"
          placeholder="Email or Mobile"
          required
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />

        <button type="submit">
         login
          </button>

        <p className="switch-link" onClick={() => navigate("/register")}>
          Don't have an account? Register
        </p>
      </form>
    </div>
  );
}

export default Login;