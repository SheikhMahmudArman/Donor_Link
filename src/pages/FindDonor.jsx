// src/pages/FindDonor.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FindDonor.css";

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const divisions = [
  'All', 'Barishal', 'Chattogram', 'Dhaka', 'Khulna', 
  'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet'
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

function FindDonor() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    bloodGroup: 'All',
    division: 'All',
    district: 'All'
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingInvite, setSendingInvite] = useState({});
  const [availableDistricts, setAvailableDistricts] = useState([]);

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  };

  const getCurrentUserId = () => {
    const user = getCurrentUser();
    return user?._id || null;
  };

  const searchDonors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.bloodGroup && filters.bloodGroup !== 'All') {
        params.append('bloodGroup', filters.bloodGroup);
      }
      if (filters.division && filters.division !== 'All') {
        params.append('division', filters.division);
      }
      if (filters.district && filters.district !== 'All') {
        params.append('district', filters.district);
      }

      const url = `http://localhost:5000/api/donors${params.toString() ? `?${params}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      const data = await response.json();

      if (response.ok) {
        setDonors(data.donors || []);
      } else {
        console.error("Error fetching donors:", data.error);
        setDonors([]);
      }
    } catch (error) {
      console.error("Search donors error:", error);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update districts when division changes
    if (filters.division && filters.division !== 'All') {
      setAvailableDistricts(districtsByDivision[filters.division] || []);
    } else {
      setAvailableDistricts([]);
    }
    // Reset district when division changes
    setFilters(prev => ({ ...prev, district: 'All' }));
  }, [filters.division]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchDonors();
  };

  const handleContactDonor = async (donor) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert("Please login first");
        navigate('/login');
        return;
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
        alert("User data not found. Please login again.");
        navigate('/login');
        return;
    }
    
    let currentUser;
    try {
        currentUser = JSON.parse(userStr);
    } catch (e) {
        alert("Invalid user data. Please login again.");
        navigate('/login');
        return;
    }
    
    const currentUserId = currentUser._id || currentUser.id;
    
    if (!currentUserId) {
        alert("User ID not found. Please login again.");
        navigate('/login');
        return;
    }

    if (currentUserId === donor.userId) {  // FIX: Compare with donor.userId
        alert("You cannot chat with yourself!");
        return;
    }

    setSendingInvite(prev => ({ ...prev, [donor._id]: true }));

    try {
        const response = await fetch('http://localhost:5000/api/chat/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                senderId: currentUserId,
                receiverId: donor.userId  // FIX: Send donor.userId
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Invitation sent to ${donor.fullName}!`);
            navigate('/chat');
        } else {
            if (data.error === "Already invited") {
                alert(`You already have a pending invitation with ${donor.fullName}.`);
                navigate('/chat');
            } else if (data.error === "Already in conversation") {
                alert(`You already have an active conversation with ${donor.fullName}.`);
                navigate('/chat');
            } else {
                alert(data.error || "Failed to send invitation");
            }
        }
    } catch (error) {
        console.error("Error sending invitation:", error);
        alert("Network error. Please check if backend is running.");
    } finally {
        setSendingInvite(prev => ({ ...prev, [donor._id]: false }));
    }
};

  function getInitials(name) {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  function getLastActiveTime(lastActive) {
    if (!lastActive) return "Unknown";
    const now = new Date();
    const last = new Date(lastActive);
    const diffMins = Math.floor((now - last) / 60000);
    
    if (diffMins <= 5) return "Active now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return "A while ago";
  }

  return (
    <div className="find-donor-page">
      <div className="find-donor-container">
        <div className="search-section">
          <h1>Find Blood Donors</h1>
          <p>Search for eligible donors based on your requirements</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label>Blood Group</label>
              <select name="bloodGroup" value={filters.bloodGroup} onChange={handleFilterChange}>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Division</label>
              <select name="division" value={filters.division} onChange={handleFilterChange}>
                {divisions.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>District</label>
              <select 
                name="district" 
                value={filters.district} 
                onChange={handleFilterChange}
                disabled={!filters.division || filters.division === 'All'}
              >
                <option value="All">All Districts</option>
                {availableDistricts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="search-btn">
              Find Donors
            </button>
          </form>
        </div>

        <div className="results-section">
          <h2>Available Donors</h2>
          <p className="donor-count">{donors.length} donor(s) found</p>

          {loading ? (
            <div className="loading">Searching for donors...</div>
          ) : donors.length === 0 ? (
            <div className="no-results">
              <p>No donors found matching your criteria.</p>
              <p>Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="donors-grid">
              {donors.map(donor => (
                <div key={donor._id} className="donor-card">
                  <div className="donor-info">
                    <div className="donor-initials">{getInitials(donor.fullName)}</div>
                    <div className="donor-name">{donor.fullName}</div>
                    <div className={`availability-tag ${donor.available ? 'available' : 'unavailable'}`}>
                      {donor.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                  <div className="donor-details">
                    <div><strong>Blood Group:</strong> <span>{donor.bloodGroup}</span></div>
                    <div><strong>Location:</strong> <span>{donor.district}, {donor.division}</span></div>
                    <div><strong>Last Active:</strong> 
                      <span className={getLastActiveTime(donor.lastActive) === "Active now" ? 'active-now' : ''}>
                        {getLastActiveTime(donor.lastActive)}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="contact-btn"
                    onClick={() => handleContactDonor(donor)}
                    disabled={sendingInvite[donor._id]}
                  >
                    {sendingInvite[donor._id] ? 'Sending...' : 'Contact Donor'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindDonor;