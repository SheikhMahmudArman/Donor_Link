import { useState, useEffect } from "react";
import '../styles/Homepage.css';
import { Link, useNavigate } from "react-router-dom";

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function Homepage() {
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDonors: 0,
        recentDonors: 0,
        donorsByBloodGroup: {}
    });
    const navigate = useNavigate();

    // Fetch donors from server
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

    // Fetch donor statistics
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
        // Check authentication
        if (!localStorage.getItem('token')) {
            navigate('/login', { replace: true });
            return;
        }
        
        fetchDonors();
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
        navigate("/chat");
    }

    function handleContactDonor(donor) {
        // This should open chat or contact form
        alert(`Contact ${donor.fullName} - Chat feature coming soon!`);
    }

    // Format last donation date
    function formatLastDonation(lastDonation) {
        if (lastDonation === 'never') return 'Never donated';
        if (lastDonation === '3') return '3+ months ago';
        if (lastDonation === '6') return '6+ months ago';
        return `${lastDonation} months ago`;
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
            {/* Header */}
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

            {/* Main Container */}
            <div className="main-container">
                {/* Sidebar */}
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

                {/* Main Content */}
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
                                    </div>
                                    <button className="contact-btn" onClick={() => handleContactDonor(donor)}>
                                        Contact
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