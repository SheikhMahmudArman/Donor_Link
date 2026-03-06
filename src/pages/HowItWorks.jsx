import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const HowItWorks = () => {
  return (
    <div className="landing-container" style={{ background: '#fff', padding: '60px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '50px' }}>
          How Donor Link Works
        </h1>

        <div style={{ display: 'grid', gap: '60px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div style={{ textAlign: 'center', padding: '30px', border: '2px solid #ffebee', borderRadius: '16px' }}>
            <div style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '20px' }}>1</div>
            <h3 style={{ color: '#b71c1c' }}>Register</h3>
            <p style={{ color: '#555' }}>
              Sign up as a donor or recipient. It takes less than a minute.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '30px', border: '2px solid #ffebee', borderRadius: '16px' }}>
            <div style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '20px' }}>2</div>
            <h3 style={{ color: '#b71c1c' }}>Update Your Profile</h3>
            <p style={{ color: '#555' }}>
              Add your blood group, location, last donation date, and availability.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '30px', border: '2px solid #ffebee', borderRadius: '16px' }}>
            <div style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '20px' }}>3</div>
            <h3 style={{ color: '#b71c1c' }}>Search or Request</h3>
            <p style={{ color: '#555' }}>
              Find donors near you or post an urgent request when needed.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '30px', border: '2px solid #ffebee', borderRadius: '16px', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '20px' }}>4</div>
            <h3 style={{ color: '#b71c1c' }}>Connect & Save Lives</h3>
            <p style={{ color: '#555' }}>
              Contact donors directly and help save lives in your community.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link to="/" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.3rem' }}>
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;