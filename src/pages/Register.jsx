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

// Blood groups data
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    emailOrPhone: "",
    division: "",
    district: "",
    cityArea: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
  });

  const [errors, setErrors] = useState({
    userName: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    division: "",
    district: "",
    bloodGroup: "",
  });

  const [touched, setTouched] = useState({
    userName: false,
    emailOrPhone: false,
    password: false,
    confirmPassword: false,
    division: false,
    district: false,
    bloodGroup: false,
  });

  const validateName = (value) => {
    if (!value) return "Full name is required";
    if (value.trim().length < 3) return "Name must be at least 3 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Name can only contain letters and spaces";
    return "";
  };

  const validateEmailOrPhone = (value) => {
    if (!value) return "Email or phone is required";
    
    // Check if it's an email (contains @ and domain)
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    // Check if it's a phone number (Bangladeshi phone number pattern)
    const phoneRegex = /^(01[3-9]\d{8})|(\+8801[3-9]\d{8})$/;
    
    if (emailRegex.test(value)) {
      return ""; // Valid email
    } else if (phoneRegex.test(value)) {
      return ""; // Valid phone
    } else {
      return "Please enter a valid email (e.g., name@example.com) or valid phone number (e.g., 017XXXXXXXX)";
    }
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) return "Please confirm your password";
    if (value !== form.password) return "Passwords do not match";
    return "";
  };

  const validateDivision = (value) => {
    if (!value) return "Please select a division";
    return "";
  };

  const validateDistrict = (value) => {
    if (!value) return "Please select a district";
    return "";
  };

  const validateBloodGroup = (value) => {
    if (!value) return "Please select your blood group";
    return "";
  };

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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    let error = "";
    switch(name) {
      case "userName":
        error = validateName(value);
        break;
      case "emailOrPhone":
        error = validateEmailOrPhone(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(value);
        break;
      case "division":
        error = validateDivision(value);
        break;
      case "district":
        error = validateDistrict(value);
        break;
      case "bloodGroup":
        error = validateBloodGroup(value);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      userName: validateName(form.userName),
      emailOrPhone: validateEmailOrPhone(form.emailOrPhone),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.confirmPassword),
      division: validateDivision(form.division),
      district: validateDistrict(form.district),
      bloodGroup: validateBloodGroup(form.bloodGroup),
    };
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    setTouched({
      userName: true,
      emailOrPhone: true,
      password: true,
      confirmPassword: true,
      division: true,
      district: true,
      bloodGroup: true,
    });
    
    // Check if there are any errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error field
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
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
          userName: form.userName,
          emailOrPhone: form.emailOrPhone,
          division: form.division,
          district: form.district,
          cityArea: form.cityArea,
          password: form.password,
          bloodGroup: form.bloodGroup,
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

  const getFieldClass = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return "error";
    }
    return "";
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <form className="register-card" onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <p className="subtitle">Join Donor Link and help save lives</p>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              className={getFieldClass("userName")}
              required
            />
            {touched.userName && errors.userName && (
              <div className="error-message">{errors.userName}</div>
            )}
          </div>

          <div className="form-group">
            <label>Email or Phone</label>
            <input
              type="text"
              name="emailOrPhone"
              value={form.emailOrPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email or phone number"
              className={getFieldClass("emailOrPhone")}
              required
            />
            {touched.emailOrPhone && errors.emailOrPhone && (
              <div className="error-message">{errors.emailOrPhone}</div>
            )}
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <select 
              name="bloodGroup" 
              value={form.bloodGroup} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClass("bloodGroup")}
              required
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            {touched.bloodGroup && errors.bloodGroup && (
              <div className="error-message">{errors.bloodGroup}</div>
            )}
          </div>

          <div className="form-group">
            <label>Division</label>
            <select 
              name="division" 
              value={form.division} 
              onChange={handleChange}
              onBlur={handleBlur}
              className={getFieldClass("division")}
              required
            >
              <option value="">Select Division</option>
              {divisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
            {touched.division && errors.division && (
              <div className="error-message">{errors.division}</div>
            )}
          </div>

          {form.division && (
            <div className="form-group">
              <label>District</label>
              <select 
                name="district" 
                value={form.district} 
                onChange={handleChange}
                onBlur={handleBlur}
                className={getFieldClass("district")}
                required
              >
                <option value="">Select District</option>
                {(districtsByDivision[form.division] || []).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {touched.district && errors.district && (
                <div className="error-message">{errors.district}</div>
              )}
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
              onBlur={handleBlur}
              placeholder="Create a strong password (min. 6 characters)"
              className={getFieldClass("password")}
              required
            />
            {touched.password && errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              className={getFieldClass("confirmPassword")}
              required
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
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