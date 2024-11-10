import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">RecordNow</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="#features">Features</Link></li>
          <li><Link to="#pricing">Pricing</Link></li>
          <li><Link to="#help">Help</Link></li>
          <li><Link to="/record" className="cta-button">Start Recording</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 