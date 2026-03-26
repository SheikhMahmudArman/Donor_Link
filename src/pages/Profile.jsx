import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

// ── Location Data ──
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
    isEligible: false,
    permanentDisqual: false,
    basicEligible: false,
    lastCheckDate: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewPic, setPreviewPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // ── Fetch user profile from backend
  useEffect(() => {
  if (!token) {
    navigate('/login');
    return;
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      console.log('Fetched user:', data); // Debug

      if (!response.ok) {
        alert(data.error || 'Failed to fetch profile');
        setLoading(false);
        return;
      }

      // Use nullish coalescing to avoid undefined
      const user = data.user ?? data ?? {};
      const now = new Date().toLocaleString();

      setUserData(prev => ({
        ...prev,
        emailOrPhone: user.emailOrPhone ?? prev.emailOrPhone,
        fullName: user.fullName ?? prev.fullName,
        division: user.division ?? prev.division,
        district: user.district ?? prev.district,
        cityArea: user.cityArea ?? prev.cityArea,
        bloodGroup: user.bloodGroup ?? prev.bloodGroup,
        profilePic: user.profilePic ?? prev.profilePic,
        permanentDisqual: user.permanentDisqual ?? false,
        basicEligible: user.basicEligible ?? false,
        isEligible: !(user.permanentDisqual ?? false) && (user.basicEligible ?? false),
        lastCheckDate: now
      }));

      setLoading(false);

    } catch (err) {
      console.error(err);
      alert('Error fetching profile');
      setLoading(false);
    }
  };

  fetchProfile();
}, [token, navigate]);

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

  // ── Save changes to backend
  const handleSave = async () => {
  try {
    // Only send relevant fields
    const updateData = {
      fullName: userData.fullName,
      emailOrPhone: userData.emailOrPhone,
      division: userData.division,
      district: userData.district,
      cityArea: userData.cityArea,
      bloodGroup: userData.bloodGroup,
      profilePic: userData.profilePic,
    };

    const response = await fetch('http://localhost:5000/api/user/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    console.log('Update response:', data); // Debug

    if (!response.ok) {
      alert(data.error || 'Failed to update profile');
      return;
    }

    setUserData(prev => ({ ...prev, ...data.user ?? data ?? {} }));
    setPreviewPic(null);
    setIsEditing(false);
    alert('Profile updated successfully!');
  } catch (err) {
    console.error(err);
    alert('Error updating profile');
  }
};

  const getEligibilityBadge = () => {
    if (userData?.permanentDisqual) return <span className="badge permanent">Permanently Deferred</span>;
    if (userData?.isEligible) return <span className="badge eligible">Eligible</span>;
    return <span className="badge temporary">Currently Not Eligible</span>;
  };

  if (loading) return <p>Loading profile...</p>;

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