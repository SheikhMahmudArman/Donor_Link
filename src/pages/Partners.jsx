import React from "react";
import "../styles/partners.css";

const partners = [
    {
        name: "Kurmitola General Hospital",
        city: "Dhaka",
    },
    {
        name: "Square Hospital",
        city: "Dhaka",
    },
    {
        name: "Chittagong Medical College",
        city: "Chittagong",
    },
    {
        name: "Sylhet MAG Osmani Hospital",
        city: "Sylhet",
    },
];

export default function Partners() {
    return (
        <section className="partners-section">
            <div className="partners-header">
                <h2>Trusted Hospitals</h2>
                <p>We work with hospitals to connect donors quickly.</p>
            </div>

            <div className="partners-grid">
                {partners.map((p, index) => (
                    <div className="partner-card" key={index}>
                        <div className="hospital-icon">🏥</div>
                        <h3>{p.name}</h3>
                        <p>{p.city}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}