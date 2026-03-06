import React, { useState } from "react";
import "../styles/Donate.css";

function Donate() {
    const [formData, setFormData] = useState({
        name: "",
        blood: "",
        location: "",
        phone: ""
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        alert("Donation Registered Successfully!");
    }

    return (
        <div className="donate-container">
            <div className="donate-card">
                <h2>Donate Blood</h2>
                
                <p>Become a lifesaver today</p>

                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                    <input type="text" name="blood" placeholder="Blood Group" onChange={handleChange} required />
                    <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
                    <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />

                    <button type="submit">Register as Donor</button>
                </form>
            </div>
        </div>
    );
}

export default Donate;