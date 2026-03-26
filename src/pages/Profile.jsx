import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

// ── Location Data (same as before) ──
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
    permanentDisqual: false,
    basicEligible: false,
    age: null,
    address: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewPic, setPreviewPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log('Fetched user data:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch profile');
        }

        // Set user data
        if (data.user) {
          setUserData({
            emailOrPhone: data.user.emailOrPhone || '',
            fullName: data.user.fullName || '',
            division: data.user.division || '',
            district: data.user.district || '',
            cityArea: data.user.cityArea || '',
            bloodGroup: data.user.bloodGroup || '',
            profilePic: data.user.profilePic || null,
            permanentDisqual: data.user.permanentDisqual || false,
            basicEligible: data.user.basicEligible || false,
            age: data.user.age || null,
            address: data.user.address || '',
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
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
      // Only send fields that are editable
      const updateData = {
        fullName: userData.fullName,
        division: userData.division,
        district: userData.district,
        cityArea: userData.cityArea,
        bloodGroup: userData.bloodGroup,
        profilePic: userData.profilePic,
        age: userData.age,
        address: userData.address,
      };

      const response = await fetch('http://localhost:5000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      console.log('Update response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update local state with response data
      if (data.user) {
        setUserData(prev => ({ ...prev, ...data.user }));
      }
      
      setPreviewPic(null);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      alert(err.message || 'Error updating profile');
    }
  };

  const isEligible = !userData.permanentDisqual && userData.basicEligible;

  const getEligibilityBadge = () => {
    if (userData.permanentDisqual) 
      return <span className="badge permanent">Permanently Deferred</span>;
    if (isEligible) 
      return <span className="badge eligible">Eligible to Donate</span>;
    return <span className="badge temporary">Currently Not Eligible</span>;
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container" style={{ textAlign: 'center', padding: '60px' }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container" style={{ textAlign: 'center', padding: '60px' }}>
          <p style={{ color: 'red' }}>Error: {error}</p>
          <button onClick={() => navigate('/login')} className="btn edit-btn">Go to Login</button>
        </div>
      </div>
    );
  }

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
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={userData.fullName || ''}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              ) : (
                <p>{userData.fullName || 'Not set'}</p>
              )}
            </div>

            <div className="info-item">
              <label>Contact (Email/Phone)</label>
              <p>{userData.emailOrPhone || 'Not set'}</p>
            </div>

            <div className="info-item full-width">
              <label>Location</label>
              {isEditing ? (
                <div className="location-edit">
                  <select name="division" value={userData.division} onChange={handleChange}>
                    <option value="">Select Division</option>
                    {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>

                  {userData.division && (
                    <select name="district" value={userData.district} onChange={handleChange}>
                      <option value="">Select District</option>
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
            {userData.permanentDisqual ? (
              <p className="note permanent">Permanently deferred from donating blood.</p>
            ) : isEligible ? (
              <p className="note success">You are eligible to donate blood. Visit a donation center to confirm.</p>
            ) : (
              <p className="note temporary">You are currently not eligible to donate. You may become eligible later.</p>
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

        {userData.age !== null && (
          <section className="profile-info">
            <h2>Age</h2>
            <p>{userData.age} years</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default Profile;