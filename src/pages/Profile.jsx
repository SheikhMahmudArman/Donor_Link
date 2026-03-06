import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const divisions = [
  'Barishal', 'Chattogram', 'Dhaka', 'Khulna', 'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet'
];

const districtsByDivision = { /* same as before - copy from Register.jsx */ };
const citiesByDistrict = { /* same as before - copy from Register.jsx */ };

function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    emailOrPhone: '',
    division: '',
    district: '',
    cityArea: '',
    fullName: '',
    bloodGroup: '',
    profilePic: null,
    // eligibility fields
    isEligible: false,
    permanentDisqual: false,
    basicEligible: false,
    lastCheckDate: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewPic, setPreviewPic] = useState(null);

  useEffect(() => {
    // Load registration data
    const savedReg = localStorage.getItem('user-registration');
    if (savedReg) {
      try {
        const regData = JSON.parse(savedReg);
        setUserData(prev => ({ ...prev, ...regData }));
      } catch {}
    }

    // Load eligibility data
    const savedElig = localStorage.getItem('blood-donor-eligibility-form');
    if (savedElig) {
      try {
        const elig = JSON.parse(savedElig);
        const now = new Date().toLocaleString();
        setUserData(prev => ({
          ...prev,
          permanentDisqual: elig.permanentDisqual || false,
          basicEligible: elig.basicEligible || false,
          isEligible: !elig.permanentDisqual && elig.basicEligible,
          lastCheckDate: now,
        }));
      } catch {}
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => {
      let updated = { ...prev, [name]: value };
      if (name === 'division') {
        updated.district = '';
        updated.cityArea = '';
      }
      if (name === 'district') {
        updated.cityArea = '';
      }
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result);
        setUserData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('user-registration', JSON.stringify({
      emailOrPhone: userData.emailOrPhone,
      division: userData.division,
      district: userData.district,
      cityArea: userData.cityArea,
      fullName: userData.fullName,
      bloodGroup: userData.bloodGroup,
      profilePic: userData.profilePic,
    }));
    setIsEditing(false);
    alert('Profile updated!');
  };

  const getEligibilityBadge = () => {
    if (userData.permanentDisqual) return <span className="badge permanent">Permanently Deferred</span>;
    if (userData.isEligible) return <span className="badge eligible">Eligible</span>;
    return <span className="badge temporary">Currently Not Eligible</span>;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <header className="profile-header">
          <h1>Your Profile</h1>
          {!isEditing ? (
            <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn save-btn" onClick={handleSave}>Save</button>
              <button className="btn cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )}
        </header>

        <section className="profile-pic-section">
          <div className="profile-avatar">
            {previewPic || userData.profilePic ? (
              <img src={previewPic || userData.profilePic} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>
          {isEditing && (
            <label className="upload-btn">
              Change Photo
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          )}
        </section>

        <section className="profile-info">
          <h2>Personal Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={userData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              ) : (
                <p>{userData.fullName || 'Not set'}</p>
              )}
            </div>

            <div className="info-item">
              <label>Contact</label>
              {isEditing ? (
                <input
                  type="text"
                  name="emailOrPhone"
                  value={userData.emailOrPhone}
                  onChange={handleChange}
                />
              ) : (
                <p>{userData.emailOrPhone || 'Not set'}</p>
              )}
            </div>

            <div className="info-item full-width">
              <label>Location</label>
              {isEditing ? (
                <div className="location-edit">
                  <select name="division" value={userData.division} onChange={handleChange}>
                    <option value="">Division</option>
                    {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>

                  {userData.division && (
                    <select name="district" value={userData.district} onChange={handleChange}>
                      <option value="">District</option>
                      {(districtsByDivision[userData.division] || []).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  )}

                  {(userData.division === 'Dhaka' || userData.division === 'Chattogram') &&
                   userData.district && citiesByDistrict[userData.district] && (
                    <select name="cityArea" value={userData.cityArea} onChange={handleChange}>
                      <option value="">Area (optional)</option>
                      {citiesByDistrict[userData.district].map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <p>
                  {userData.division && userData.district
                    ? `${userData.district}, ${userData.division}${userData.cityArea ? ` - ${userData.cityArea}` : ''}`
                    : 'Not set'}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="profile-info">
          <h2>Blood Donation Status</h2>
          <div className="eligibility-card">
            <div className="badge-container">{getEligibilityBadge()}</div>
            {userData.lastCheckDate && (
              <p className="last-check">Last checked: {userData.lastCheckDate}</p>
            )}
            {userData.permanentDisqual ? (
              <p className="note permanent">Permanently deferred from donating.</p>
            ) : userData.isEligible ? (
              <p className="note success">You appear eligible — confirm at center.</p>
            ) : (
              <p className="note temporary">Currently not eligible — may change later.</p>
            )}
            {!isEditing && (
              <button className="btn update-btn" onClick={() => navigate('/eligibility')}>
                Update Eligibility
              </button>
            )}
          </div>
        </section>

        <section className="profile-info">
          <h2>Blood Group</h2>
          {isEditing ? (
            <select name="bloodGroup" value={userData.bloodGroup} onChange={handleChange}>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          ) : (
            <p>{userData.bloodGroup || 'Not set'}</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;