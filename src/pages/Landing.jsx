import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';
import './Login.js';
import './Register.js';



const Landing = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="logo">
            <span className="heart">🫀</span> Donor Link
          </div>
          <p className="tagline">Saving lives together</p>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">2,847</span>
              <span className="stat-label">Active Donors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">8,392</span>
              <span className="stat-label">Lives Saved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">+156</span>
              <span className="stat-label">This Month</span>
            </div>
          </div>

          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Urgent Request Banner */}
      <section className="urgent-banner">
        <div className="urgent-content">
          <span className="urgent-label">● Urgent Request</span>
          <p>
            O- needed urgently in Brooklyn Hospital – can you help today?
          </p>
          <Link to="/find-donor" className="btn btn-urgent">
            Find / Respond
          </Link>
        </div>
      </section>

      {/* Call to Action Cards */}
      <section className="actions-section">
        <h2>How You Can Help</h2>
        <div className="action-cards">
          <div className="action-card">
            <div className="icon">🩸</div>
            <h3>Donate Blood</h3>
            <p>Join our community of life-savers and donate today.</p>
            <Link to="/donate" className="btn btn-secondary">
              Donate Now
            </Link>
          </div>

          <div className="action-card">
            <div className="icon">🔍</div>
            <h3>Find a Donor</h3>
            <p>Search for compatible donors near you in minutes.</p>
            <Link to="/find-donor" className="btn btn-secondary">
              Search Donors
            </Link>
          </div>

          <div className="action-card">
            <div className="icon">🆎</div>
            <h3>Request Blood</h3>
            <p>Post an urgent request and connect with donors fast.</p>
            <Link to="/request" className="btn btn-secondary">
              Make Request
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Donor Link. All rights reserved.</p>
       <div className="footer-links">
  <Link to="/about">About Us</Link>
  <Link to="/how-it-works">How It Works</Link>
  <Link to="/privacy-policy">Privacy Policy</Link>
  <Link to="/contact">Contact</Link>
</div>
      </footer>
    </div>
  );
};

export default Landing;