import { useState } from "react";
import '../styles/Homepage.css';
import { Link, useNavigate } from "react-router-dom";

const donorsList = [
    { id: 1, name: 'Fatima Rahman', bloodGroup: 'A+', location: 'Dhaka', lastDonation: '2 weeks ago', available: true },
    { id: 2, name: 'Rafiq Ahmed', bloodGroup: 'O-', location: 'Chittagong', lastDonation: '1 month ago', available: true },
    { id: 3, name: 'Nadia Hossain', bloodGroup: 'B+', location: 'Sylhet', lastDonation: '3 weeks ago', available: false },
    { id: 4, name: 'Kamal Uddin', bloodGroup: 'AB+', location: 'Rajshahi', lastDonation: '1 week ago', available: true },
    { id: 5, name: 'Ayesha Begum', bloodGroup: 'A-', location: 'Khulna', lastDonation: '2 months ago', available: true },
    { id: 6, name: 'Shakib Khan', bloodGroup: 'O+', location: 'Dhaka', lastDonation: '5 days ago', available: true },
    { id: 7, name: 'Tahmina Akter', bloodGroup: 'B-', location: 'Comilla', lastDonation: '1 week ago', available: true },
    { id: 8, name: 'Imran Hasan', bloodGroup: 'AB-', location: 'Barisal', lastDonation: '3 weeks ago', available: true },
];

const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function Homepage() {
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('All');
    const navigate = useNavigate();

    const filteredDonors = selectedBloodGroup === 'All' ? donorsList : donorsList.filter(d => d.bloodGroup === selectedBloodGroup);

    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('');
    }

    function handleLogout() {
        alert('Logout functionality - Would clear session and redirect to login');
    }

    function handleDonate() {
        alert('Donate feature - Would redirect to donation registration form');
    }

    function handleChat() {
        alert('Chat feature - Would open messaging system');
    }

    function handleContactDonor(donor) {
        alert(`Contact ${donor.name} - Would open contact form or messaging`);
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
                    <div className="profile-icon" title="User Profile">
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
                        <div><span>Active Donors</span> <span>1,847</span></div>
                        <div><span>Lives Saved</span> <span>5,392</span></div>
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
                            <button className="btn-donate" onClick={handleDonate}>Donate Blood</button>
                            <Link to="/find-donor" className="btn-find-donor">Find a Donor</Link>
                            <button className="btn-chat" onClick={handleChat} title="Live Chat">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <h2 className="donors-header">Available Donors</h2>
                    <p className="donor-count">{filteredDonors.length} donor(s) found</p>

                    <div className="donors-grid">
                        {filteredDonors.map(donor => (
                            <div key={donor.id} className="donor-card">
                                <div className="donor-info">
                                    <div className="donor-initials">{getInitials(donor.name)}</div>
                                    <div className="donor-name">{donor.name}</div>
                                    <div className={`availability-tag ${donor.available ? 'available' : 'unavailable'}`}>
                                        {donor.available ? 'Available' : 'Unavailable'}
                                    </div>
                                </div>
                                <div className="donor-details">
                                    <div><strong>Blood Group:</strong> <span>{donor.bloodGroup}</span></div>
                                    <div><strong>Location:</strong> <span>{donor.location}</span></div>
                                    <div><strong>Last Donation:</strong> <span>{donor.lastDonation}</span></div>
                                </div>
                                <button className="contact-btn" onClick={() => handleContactDonor(donor)}>Contact</button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}

export default Homepage;