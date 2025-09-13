import React from 'react';

const Modal = ({ open, title, children, onClose, actions }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title || 'Dialog'}>
      <div className="modal glass">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="secondary-button" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;
