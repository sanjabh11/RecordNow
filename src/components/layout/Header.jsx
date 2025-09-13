import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal.jsx';

const Header = () => {
  const [theme, setTheme] = useState('light');
  const [openFaq, setOpenFaq] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('rn_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const t = saved || (prefersDark ? 'dark' : 'light');
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('rn_theme', next);
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : 'light');
  };

  return (
    <>
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
        <button aria-label="Toggle theme" className="secondary-button" onClick={toggleTheme} style={{ marginLeft: 'auto' }}>
          {theme === 'dark' ? '🌙 Dark' : '🌞 Light'}
        </button>
      </header>
      <div className="info-banner" role="note">
        Recordings are stored locally on this device. Sharing creates a local link that only works here. No remote upload or account.
        <button className="secondary-button" style={{ marginLeft: 12 }} onClick={() => setOpenFaq(true)}>Privacy & Storage FAQ</button>
      </div>
      <Modal open={openFaq} onClose={() => setOpenFaq(false)} title="Privacy & Storage FAQ">
        <details open>
          <summary>Can I move recordings between devices?</summary>
          <p>Not in this local-first build. Links only work on the device/browser where they were created. To move, export audio (coming soon) and import on the other device.</p>
        </details>
        <details>
          <summary>Where are my recordings stored?</summary>
          <p>In your browser’s IndexedDB storage, keyed by a local anonymous ID. No cloud account or remote uploads are used.</p>
        </details>
        <details>
          <summary>How do I back up?</summary>
          <p>Use the Share/Embed or future Export options to save a copy. Clearing site data or using private browsing may remove recordings.</p>
        </details>
        <details>
          <summary>What does Delete Link do?</summary>
          <p>Each note has a local delete token. Visiting the delete link on this device will delete the recording from your local storage.</p>
        </details>
      </Modal>
    </>
  );
};

export default Header;