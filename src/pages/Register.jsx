import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";


// ── Full Location Data ──
const divisions = [
  'Barishal', 'Chattogram', 'Dhaka', 'Khulna', 'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet'
];

const districtsByDivision = {
  Barishal: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Chattogram: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Comilla', "Cox's Bazar", 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  Dhaka: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  Khulna: ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
  Rajshahi: ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Rajshahi', 'Sirajganj'],
  Rangpur: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
  Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
};

const citiesByDistrict = {
  Dhaka: ['Dhaka City North', 'Dhaka City South', 'Savar', 'Keraniganj', 'Narayanganj', 'Gazipur City', 'Other'],
  Chattogram: ['Chattogram City', "Cox's Bazar", 'Comilla City', 'Other'],
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emailOrPhone: "",
    division: "",
    district: "",
    cityArea: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const newForm = { ...prev, [name]: value };
      if (name === 'division') {
        newForm.district = '';
        newForm.cityArea = '';
      }
      if (name === 'district') {
        newForm.cityArea = '';
      }
      return newForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!form.division || !form.district) {
      alert("Please select Division and District.");
      return;
    }

    // Save registration data to backend
    try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailOrPhone: form.emailOrPhone,
        division: form.division,
        district: form.district,
        cityArea: form.cityArea,
        password: form.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration Successful!");
      navigate("/login");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <form className="register-card" onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <p className="subtitle">Join Donor Link and help save lives</p>

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
            <label>Division</label>
            <select name="division" value={form.division} onChange={handleChange} required>
              <option value="">Select Division</option>
              {divisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>

          {form.division && (
            <div className="form-group">
              <label>District</label>
              <select name="district" value={form.district} onChange={handleChange} required>
                <option value="">Select District</option>
                {(districtsByDivision[form.division] || []).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          {(form.division === 'Dhaka' || form.division === 'Chattogram') &&
           form.district &&
           citiesByDistrict[form.district] && (
            <div className="form-group">
              <label>Area (optional)</label>
              <select name="cityArea" value={form.cityArea} onChange={handleChange}>
                <option value="">Select Area</option>
                {citiesByDistrict[form.district].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="register-btn">Register</button>
          
          <p className="login-link">
            Already have an account? <span onClick={() => navigate("/login")}>Log in</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;