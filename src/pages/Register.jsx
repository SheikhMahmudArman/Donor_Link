import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const cityData = {
  Dhaka: ["Dhanmondi", "Gulshan", "Mirpur"],
  Chittagong: ["Agrabad", "Pahartali", "Halishahar"],
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrPhone: "",
    city: "",
    area: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password does not match!");
      return;
    }

    alert("Registration Successful!");
    navigate("/login");
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          type="text"
          name="emailOrPhone"
          placeholder="Email or Phone"
          required
          onChange={handleChange}
        />

        <select name="city" required onChange={handleChange}>
          <option value="">Select City</option>
          {Object.keys(cityData).map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>

        {form.city && (
          <select name="area" required onChange={handleChange}>
            <option value="">Select Area</option>
            {cityData[form.city].map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;