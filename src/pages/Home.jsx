import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      
      <section className="hero" role="region" aria-label="Hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-content glass reveal">
          <h1 className="hero-title">Record, Share, Connect</h1>
          <p className="hero-subtitle">Free online voice recorder - No registration required</p>
          <div className="cta-buttons">
            <Link to="/record" className="primary-button">Start Recording</Link>
            <Link to="/record" className="secondary-button">Upload Audio</Link>
          </div>
        </div>
      </section>

      <section className="features reveal" role="region" aria-label="Why Choose RecordNow?">
        <h2>Why Choose RecordNow?</h2>
        <div className="feature-grid">
          <div className="feature-card glass">
            <span className="icon">⏱️</span>
            <h3>2-Minute Recordings</h3>
            <p>Record up to 120 seconds of high-quality audio</p>
          </div>
          <div className="feature-card glass">
            <span className="icon">🎤</span>
            <h3>Easy Sharing</h3>
            <p>Share instantly via link or embed</p>
          </div>
          <div className="feature-card glass">
            <span className="icon">🔒</span>
            <h3>No Sign-up Required</h3>
            <p>Start recording immediately</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home; 