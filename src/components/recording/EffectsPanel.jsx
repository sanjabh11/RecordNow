import React, { useState } from 'react';

// Visual-only panel for now; wire into audio graph later if needed
const EffectsPanel = ({ disabled }) => {
  const [open, setOpen] = useState(false);
  const [echo, setEcho] = useState(false);
  const [reverb, setReverb] = useState(false);
  const [pitch, setPitch] = useState(0); // semitones
  const [preset, setPreset] = useState('none');

  const reset = () => {
    setEcho(false);
    setReverb(false);
    setPitch(0);
    setPreset('none');
  };

  return (
    <section className="effects glass">
      <button
        className="secondary-button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        aria-expanded={open}
        aria-controls="effects-body"
      >
        {open ? 'Hide Effects' : 'Show Effects'}
      </button>
      {open && (
        <div id="effects-body" className="effects-body">
          <div className="effects-row">
            <label className="effects-toggle">
              <input type="checkbox" disabled={disabled} checked={echo} onChange={e => setEcho(e.target.checked)} />
              <span>Echo</span>
            </label>
            <label className="effects-toggle">
              <input type="checkbox" disabled={disabled} checked={reverb} onChange={e => setReverb(e.target.checked)} />
              <span>Reverb</span>
            </label>
          </div>

          <div className="effects-row">
            <label className="effects-field">
              <span>Pitch Shift (semitones)</span>
              <input type="range" min="-12" max="12" step="1" value={pitch} onChange={e => setPitch(parseInt(e.target.value, 10))} disabled={disabled} />
              <div className="effects-value">{pitch}</div>
            </label>
          </div>

          <div className="effects-row">
            <div className="preset-chips">
              {['none','robot','deep','helium'].map(p => (
                <button
                  key={p}
                  className={`chip ${preset === p ? 'chip-active' : ''}`}
                  disabled={disabled}
                  onClick={() => setPreset(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="effects-actions">
            <button className="secondary-button" onClick={reset} disabled={disabled}>Reset Effects</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default EffectsPanel;
