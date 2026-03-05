import React from "react";
import '../styles/FindDonor.css';

const donors = [
    {
        name: "Rahim Ahmed",
        blood: "A+",
        location: "Dhaka",
        phone: "017XXXXXXXX",
    },
    {
        name: "Nusrat Jahan",
        blood: "O-",
        location: "Mirpur",
        phone: "018XXXXXXXX",
    },
    {
        name: "Karim Hasan",
        blood: "B+",
        location: "Uttara",
        phone: "019XXXXXXXX",
    },
];

function FindDonor() {
    return (
        <div className="find-container">

            {/* Header */}
            <div className="find-header">
                <h1>Find a Blood Donor</h1>
                <p>Search for available donors near your location</p>
            </div>

            {/* Search Section */}
            <div className="search-box">
                <select>
                    <option>Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                </select>

                <input type="text" placeholder="Enter Location" />

                <button className="search-btn">Search</button>
            </div>

            {/* Donor List */}
            <div className="donor-grid">
                {donors.map((donor, index) => (
                    <div className="donor-card" key={index}>
                        <div className="blood">{donor.blood}</div>
                        <h3>{donor.name}</h3>
                        <p>📍 {donor.location}</p>
                        <p>📞 {donor.phone}</p>

                        <button className="contact-btn">
                            Contact Donor
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FindDonor;