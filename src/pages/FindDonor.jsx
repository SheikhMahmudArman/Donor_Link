import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FindDonor.css";

function FindDonor() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    guardianPhone: "",
    userPhone: "",
    requiredDate: "",
    timeSlot: "",
    hospitalName: "",
    division: "",
    district: "",
    area: "",
    patientName: "",
    bloodGroup: "",
    unitsNeeded: "1",
    urgency: "normal",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.guardianPhone || !form.requiredDate || !form.hospitalName || !form.bloodGroup) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        alert("Request submitted successfully!");
        navigate("/homepage");
      } else {
        alert("Failed to submit request");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="find-donor-page">
      <div className="find-donor-container">
        <form className="find-donor-card" onSubmit={handleSubmit}>
          <h1>Request Blood Donor</h1>
          <p className="subtitle">
            Fill in the details below so we can help connect you with nearby donors
          </p>

          <div className="form-grid">
            {/* Patient Info */}
            <div className="form-group">
              <label>Patient's Name *</label>
              <input
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Full name of the patient"
                required
              />
            </div>

            <div className="form-group">
              <label>Blood Group Required *</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="form-group">
              <label>Units Needed *</label>
              <input
                type="number"
                name="unitsNeeded"
                value={form.unitsNeeded}
                onChange={handleChange}
                min="1"
                max="10"
                placeholder="Number of bags"
                required
              />
            </div>

            {/* Contact */}
            <div className="form-group">
              <label>Guardian / Family Phone *</label>
              <input
                type="tel"
                name="guardianPhone"
                value={form.guardianPhone}
                onChange={handleChange}
                placeholder="Primary contact number"
                required
              />
            </div>

            <div className="form-group">
              <label>Your Phone (optional)</label>
              <input
                type="tel"
                name="userPhone"
                value={form.userPhone}
                onChange={handleChange}
                placeholder="Your contact number"
              />
            </div>

            {/* When & Where */}
            <div className="form-group">
              <label>Date Blood Required *</label>
              <input
                type="date"
                name="requiredDate"
                value={form.requiredDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Preferred Time Slot *</label>
              <select name="timeSlot" value={form.timeSlot} onChange={handleChange} required>
                <option value="">Select time</option>
                <option value="Morning (6AM-12PM)">Morning (6AM - 12PM)</option>
                <option value="Afternoon (12PM-6PM)">Afternoon (12PM - 6PM)</option>
                <option value="Evening (6PM-10PM)">Evening (6PM - 10PM)</option>
                <option value="Anytime">Anytime</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Hospital Name *</label>
              <input
                type="text"
                name="hospitalName"
                value={form.hospitalName}
                onChange={handleChange}
                placeholder="e.g. Dhaka Medical College Hospital"
                required
              />
            </div>

            <div className="form-group">
              <label>Division *</label>
              <select name="division" value={form.division} onChange={handleChange} required>
                <option value="">Select Division</option>
                {["Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>District / Area *</label>
              <input
                type="text"
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="e.g. Shahbag, Mirpur, Agrabad"
                required
              />
            </div>

            {/* Urgency */}
            <div className="form-group full-width">
              <label>Urgency Level</label>
              <div className="radio-group">
                {["Normal", "Urgent", "Emergency"].map(level => (
                  <label key={level} className="radio-label">
                    <input
                      type="radio"
                      name="urgency"
                      value={level.toLowerCase()}
                      checked={form.urgency === level.toLowerCase()}
                      onChange={handleChange}
                    />
                    <span>{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Submit Blood Request
          </button>

          <p className="back-link" onClick={() => navigate("/homepage")}>
            ← Back to Home
          </p>
        </form>
      </div>
    </div>
  );
}

export default FindDonor;