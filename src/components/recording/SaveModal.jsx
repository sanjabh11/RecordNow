import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal.jsx';

const SaveModal = ({ open, onClose, onConfirm, defaultTitle = 'New Recording', duration = 0, initialDisplayName = '' }) => {
  const [title, setTitle] = useState(defaultTitle);
  const [format, setFormat] = useState('webm');
  const [displayName, setDisplayName] = useState(initialDisplayName || '');

  useEffect(() => {
    if (open) {
      setTitle(defaultTitle);
      setDisplayName(initialDisplayName || '');
    }
  }, [open, defaultTitle, initialDisplayName]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save Recording"
      actions={(
        <>
          <button className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={() => onConfirm({ title, format, displayName })}>Save</button>
        </>
      )}
    >
      <label>
        <div>Title</div>
        <input className="title-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title your note" />
      </label>
      <label>
        <div>Your name (optional)</div>
        <input className="title-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., Alex" />
      </label>
      <label>
        <div>Format</div>
        <select className="secondary-button" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="webm">WEBM (default)</option>
        </select>
      </label>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Duration: {Math.round(duration)}s</div>
    </Modal>
  );
};

export default SaveModal;
