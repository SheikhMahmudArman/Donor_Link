import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const PrivacyPolicy = () => {
  return (
    <div className="landing-container" style={{ background: '#fff', padding: '60px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', lineHeight: '1.8', color: '#444' }}>
        <h1 style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '40px' }}>
          Privacy Policy
        </h1>

        <p><strong>Last updated: March 2026</strong></p>

        <p>
          At Donor Link, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
        </p>

        <h2 style={{ color: '#b71c1c', marginTop: '40px' }}>1. Information We Collect</h2>
        <ul>
          <li>Name and contact number (optional for donors)</li>
          <li>Blood group and last donation date</li>
          <li>Location (city/area – never exact coordinates)</li>
          <li>Email (for account recovery – optional)</li>
        </ul>

        <h2 style={{ color: '#b71c1c', marginTop: '40px' }}>2. How We Use Your Information</h2>
        <ul>
          <li>To connect donors with people in need</li>
          <li>To show relevant search results</li>
          <li>To send important notifications (only when necessary)</li>
        </ul>

        <h2 style={{ color: '#b71c1c', marginTop: '40px' }}>3. Data Sharing</h2>
        <p>We <strong>do not sell</strong> your data. Your phone number is only visible to users who match your blood group and are searching in your area.</p>

        <h2 style={{ color: '#b71c1c', marginTop: '40px' }}>4. Your Rights</h2>
        <p>You can delete your account anytime from settings. All your data will be permanently removed.</p>

        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link to="/" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1.3rem' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;