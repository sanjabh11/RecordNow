import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal.jsx';

const RecordingHeader = ({ recordingCount }) => {
  const [open, setOpen] = useState(false);
  const nearingLimit = recordingCount >= 8;
  return (
    <header className="recording-header">
      <div className="logo">
        <Link to="/">RecordNow</Link>
      </div>
      <div className="recording-counter">
        <span><strong>{recordingCount}</strong> of <strong>10</strong> local recordings used</span>
        {nearingLimit && <span className="expiry-notice">Approaching limit</span>}
        <button className="upgrade-link" onClick={() => setOpen(true)}>Upgrade for unlimited</button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Upgrade to Premium" actions={(
        <>
          <button className="secondary-button" onClick={() => setOpen(false)}>Close</button>
          <a className="primary-button" href="#" onClick={(e) => { e.preventDefault(); setOpen(false); }}>Continue</a>
        </>
      )}>
        <p>Unlock unlimited local recordings and advanced features:</p>
        <ul>
          <li>Unlimited recordings</li>
          <li>Advanced effects and export formats</li>
          <li>Priority updates</li>
        </ul>
        <p>No account required for local use. Upgrade any time.</p>
      </Modal>
    </header>
  );
};

export default RecordingHeader;