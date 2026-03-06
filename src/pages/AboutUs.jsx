import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css'; // reuse existing styles or create a shared one

const AboutUs = () => {
  return (
    <div className="landing-container" style={{ background: '#fff', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '40px' }}>
          About Donor Link
        </h1>

        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#b71c1c' }}>Our Mission</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#444' }}>
            Donor Link is a community-driven platform dedicated to connecting blood donors with those in urgent need. 
            We believe that every life matters, and timely blood donation can save lives in emergencies, surgeries, 
            and for patients with chronic conditions.
          </p>
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#b71c1c' }}>What We Do</h2>
          <ul style={{ fontSize: '1.15rem', lineHeight: '2', color: '#555', paddingLeft: '30px' }}>
            <li>Enable fast and location-based donor search</li>
            <li>Allow users to register as donors and update availability</li>
            <li>Raise urgent blood requests with real-time notifications</li>
            <li>Promote awareness about safe blood donation practices</li>
            <li>Build a supportive community of life-savers</li>
          </ul>
        </section>

        <section style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link to="/" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.3rem' }}>
            Back to Home
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;