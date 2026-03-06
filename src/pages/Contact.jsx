import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Contact = () => {
  return (
    <div className="landing-container" style={{ background: '#fff', padding: '60px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#d32f2f', marginBottom: '40px' }}>Contact Us</h1>

        <p style={{ fontSize: '1.3rem', marginBottom: '40px', color: '#555' }}>
          Have questions, suggestions, or need support?<br />
          We're here to help!
        </p>

        <div style={{ 
          background: '#ffebee', 
          padding: '40px', 
          borderRadius: '16px', 
          maxWidth: '600px', 
          margin: '0 auto 60px',
          border: '2px solid #d32f2f'
        }}>
          <h3 style={{ color: '#b71c1c', marginBottom: '20px' }}>Get in Touch</h3>
          
          <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
            📧 Email: <strong>support@donorlink.org</strong>
          </p>
          
          <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
            📞 Hotline: <strong>+880 17XX-XXXXXX</strong> (9 AM – 9 PM)
          </p>
          
          <p style={{ fontSize: '1.1rem', marginTop: '40px', color: '#666' }}>
            For urgent blood requests, please use the platform directly instead of emailing.
          </p>
        </div>

        <Link to="/" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.3rem' }}>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Contact;