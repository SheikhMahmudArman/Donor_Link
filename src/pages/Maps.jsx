import React from "react";
import "../styles/maps.css";

export default function Map() {
    return (
        <section className="map-section">
            <h2>Nearby Blood Banks</h2>
            <p>Find blood banks near you.</p>

            <div className="map-container">
                <iframe
                    title="blood banks"
                    src="https://maps.google.com/maps?q=dhaka%20blood%20bank&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                ></iframe>
            </div>
        </section>
    );
}