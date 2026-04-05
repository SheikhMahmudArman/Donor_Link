import { useState, useEffect } from "react";
import '../styles/Homepage.css';
import { Link, useNavigate, useLocation } from "react-router-dom";

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function Homepage() {
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
    const location = useLocation();
    const [donors, setDonors] = useState(Array.isArray(location.state?.matchingDonors) ? location.state.matchingDonors : []);
    const [loading, setLoading] = useState(!location.state?.matchingDonors);
    const [stats, setStats] = useState({
        totalDonors: 0,
        recentDonors: 0,
        donorsByBloodGroup: {}
    });
    const [sendingInvite, setSendingInvite] = useState({});
    const navigate = useNavigate();

    // FIXED: Better way to get current user
   const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        const user = JSON.parse(userStr);
        console.log("Current user from localStorage:", user);
        return user;
    } catch (e) {
        console.error("Error parsing user:", e);
        return null;
    }
};

const getCurrentUserId = () => {
    const user = getCurrentUser();
    
    return user?._id || user?.id || null;
};
    const fetchDonors = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = selectedBloodGroup === 'All'
                ? 'http://localhost:5000/api/donors'
                : `http://localhost:5000/api/donors?bloodGroup=${selectedBloodGroup}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            const data = await response.json();

            if (response.ok) {
                setDonors(data.donors);
            } else {
                console.error("Error fetching donors:", data.error);
            }
        } catch (error) {
            console.error("Fetch donors error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/donors/stats', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            const data = await response.json();

            if (response.ok) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Fetch stats error:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = getCurrentUser();

        console.log("=== Homepage Debug ===");
        console.log("Token exists?", !!token);
        console.log("User exists?", !!user);
        console.log("User ID:", user?._id);

        if (!token || !user) {
            console.log("No token or user, redirecting to login");
            navigate('/login', { replace: true });
            return;
        }

        if (!location.state?.matchingDonors || donors.length === 0) {
            fetchDonors();
        }
        fetchStats();
    }, [selectedBloodGroup, navigate]);

    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    function handleLogout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/', { replace: true });
    }

    function handleChat() {
        const token = localStorage.getItem('token');
        const user = getCurrentUser();

        if (!token || !user) {
            alert("Please login first");
            navigate('/login');
            return;
        }
        navigate("/chat");
    }

    
async function handleContactDonor(donor) {
    console.log("=== Contact Donor Debug ===");
    console.log("Donor object:", donor);
    console.log("Donor userId:", donor.userId);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert("Please login first");
        navigate('/login');
        return;
    }

    // Check if donor has userId
    if (!donor.userId) {
        console.error("Donor has no userId:", donor);
        alert("This donor's user information is missing. Please try again later.");
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
        console.log("Current user:", currentUser);
    } catch (e) {
        console.error("Error parsing user:", e);
        alert("Invalid user data. Please login again.");
        navigate('/login');
        return;
    }
    
    const currentUserId = currentUser._id || currentUser.id;
    console.log("Current User ID:", currentUserId);
    
    if (!currentUserId) {
        alert("User ID not found. Please login again.");
        navigate('/login');
        return;
    }

    if (currentUserId === donor.userId) {
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
                receiverId: donor.userId  
            })
        });

        const data = await response.json();
        console.log("Invite response:", response.status, data);

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
        alert("Network error: " + error.message);
    } finally {
        setSendingInvite(prev => ({ ...prev, [donor._id]: false }));
    }
}
    function formatLastDonation(lastDonation) {
        if (lastDonation === 'never') return 'Never donated';
        if (lastDonation === '3') return '3+ months ago';
        if (lastDonation === '6') return '6+ months ago';
        return `${lastDonation} months ago`;
    }

    function getLastActiveTime(lastActive) {
        if (!lastActive) return "Unknown";

        const now = new Date();
        const last = new Date(lastActive);
        const diffMs = now - last;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins <= 5) return "Active now";
        if (diffMins < 60) return `${diffMins} min ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return "A while ago";
    }

    if (loading) {
        return (
            <div className="homepage-container">
                <header className="header">
                    <div className="header-left">
                        <div>
                            <h1>Donor Link</h1>
                            <p>Connecting Lives. Saving Futures.</p>
                        </div>
                    </div>
                </header>
                <div className="main-container">
                    <main className="main-content">
                        <div style={{ textAlign: 'center', padding: '100px' }}>
                            <p>Loading donors...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <div>
                        <h1>Donor Link</h1>
                        <p>Connecting Lives. Saving Futures.</p>
                    </div>
                </div>
                <div className="header-right">
                    <div
                        className="profile-icon"
                        title="View Profile"
                        onClick={() => navigate("/profile")}
                        style={{ cursor: 'pointer' }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="#b71c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="7" r="4" />
                            <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
                        </svg>
                    </div>
                </div>
            </header>

            <div className="main-container">
                <aside className="sidebar">
                    <h2>Quick Actions</h2>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>

                    <div className="stats-card">
                        <h3>Platform Impact</h3>
                        <div>
                            <span>Active Donors</span>
                            <span>{stats.totalDonors || 0}</span>
                        </div>
                        <div>
                            <span>Lives Saved</span>
                            <span>{Math.floor((stats.totalDonors || 0) * 2.5)}</span>
                        </div>
                        <div>
                            <span>New This Month</span>
                            <span>{stats.recentDonors || 0}</span>
                        </div>
                    </div>

                    <div className="emergency-alert">
                        <div className="pulse-dot"></div>
                        Emergency Alert: Blood group O- urgently needed in Dhaka.
                    </div>
                </aside>

                <main className="main-content">
                    <div className="action-bar">
                        <div className="blood-filter">
                            <select value={selectedBloodGroup} onChange={e => setSelectedBloodGroup(e.target.value)}>
                                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                        <div className="action-buttons">
                            <Link to="/eligibility" className="btn-donate">
                                Donate Blood
                            </Link>
                            <Link to="/find-donor" className="btn-find-donor">
                                Find Donor
                            </Link>
                            <button className="btn-chat" onClick={handleChat} title="Live Chat">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <h2 className="donors-header">Available Donors</h2>
                    <p className="donor-count">{donors.length} eligible donor(s) found</p>

                    <div className="donors-grid">
                        {donors.length === 0 ? (
                            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>
                                <p>No eligible donors found for this blood group.</p>
                            </div>
                        ) : (
                            donors.map(donor => (
                                <div key={donor._id} className="donor-card">
                                    <div className="donor-info">
                                        <div className="donor-initials">{getInitials(donor.fullName)}</div>
                                        <div className="donor-name">{donor.fullName}</div>
                                        <div className={`availability-tag ${donor.available ? 'available' : 'unavailable'}`}>
                                            {donor.available ? 'Available' : 'Unavailable'}
                                        </div>
                                    </div>
                                    <div className="donor-details">
                                        <div>
                                            <strong>Blood Group:</strong>
                                            <span>{donor.bloodGroup}</span>
                                        </div>
                                        <div>
                                            <strong>Location:</strong>
                                            <span>{donor.district}, {donor.division}</span>
                                        </div>
                                        <div>
                                            <strong>Last Donation:</strong>
                                            <span>{formatLastDonation(donor.lastDonation)}</span>
                                        </div>
                                        <div>
                                            <strong>Last Active:</strong>
                                            <span className={`last-active ${getLastActiveTime(donor.lastActive) === "Active now" ? 'active-now' : ''}`}>
                                                {getLastActiveTime(donor.lastActive)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="contact-btn"
                                        onClick={() => handleContactDonor(donor)}
                                        disabled={sendingInvite[donor._id] || donor._id === getCurrentUserId()}
                                    >
                                        {sendingInvite[donor._id] ? 'Sending...' : 'Contact'}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default Homepage;