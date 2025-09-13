import React, { useState } from 'react';
import { analytics } from '../../utils/analytics';
import { toast } from '../ui/Toasts.jsx';

const SharingOptions = ({ recording }) => {
  const [copied, setCopied] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const generateShareableLink = () => {
    if (!recording || !recording.id) return '';
    return `${window.location.origin}/n/${recording.id}`;
  };

  const generateDeleteLink = () => {
    if (!recording || !recording.id || !recording.deleteToken) return '';
    return `${window.location.origin}/n/${recording.id}?delete_token=${recording.deleteToken}`;
  };

  const generateEmbedCode = () => {
    const link = generateShareableLink();
    return `<iframe src="${link}" width="100%" height="160" frameborder="0"></iframe>`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast('Copied to clipboard');
    });
  };

  const handleShare = (platform) => {
    const link = generateShareableLink();
    const text = 'Check out my recording on RecordNow!';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`
    };

    const w = window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
    if (w) {
      // Extra safety for browsers that ignore features
      w.opener = null;
    }
    analytics.event('share_click', { platform, link });
  };

  return (
    <div className="sharing-options">
      <h3>Share Your Recording</h3>
      <ol className="share-steps">
        <li className="glass" style={{ padding: 12, borderRadius: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Copy link</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Local link works only on this device/browser.</div>
            </div>
            <button 
              className="primary-button"
              onClick={() => {
                const link = generateShareableLink();
                copyToClipboard(link);
                analytics.event('copy_link', { link });
              }}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </li>

        <li className="glass" style={{ padding: 12, borderRadius: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Get embed code</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Embed a small player into a page</div>
            </div>
            <button className="secondary-button" onClick={() => setEmbedOpen(!embedOpen)}>
              {embedOpen ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
          {embedOpen && (
            <div style={{ marginTop: 10 }}>
              <textarea className="embed-code" readOnly value={generateEmbedCode()} rows={3} />
              <div style={{ marginTop: 8 }}>
                <button
                  className="secondary-button"
                  onClick={() => {
                    const code = generateEmbedCode();
                    copyToClipboard(code);
                    analytics.event('copy_embed', { length: code.length });
                  }}
                >
                  Copy Embed Code
                </button>
              </div>
            </div>
          )}
        </li>

        <li className="glass" style={{ padding: 12, borderRadius: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600 }}>More options</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Share on social platforms</div>
            </div>
            <button className="secondary-button" onClick={() => setMoreOpen(true)}>Open</button>
          </div>
        </li>
      </ol>

      {moreOpen && (
        <div className="modal glass" role="dialog" aria-modal="true" style={{ padding: 16, borderRadius: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0 }}>Share</h4>
            <button className="secondary-button" onClick={() => setMoreOpen(false)}>Close</button>
          </div>
          <div className="social-share" style={{ marginTop: 12 }}>
            <button className="secondary-button" onClick={() => handleShare('whatsapp')}>WhatsApp</button>
            <button className="twitter" onClick={() => handleShare('twitter')}>Twitter</button>
            <button className="facebook" onClick={() => handleShare('facebook')}>Facebook</button>
            <button className="linkedin" onClick={() => handleShare('linkedin')}>LinkedIn</button>
          </div>
          {recording?.deleteToken && (
            <div style={{ marginTop: 12 }}>
              <button className="danger-button" onClick={() => copyToClipboard(generateDeleteLink())}>Copy Delete Link</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SharingOptions; 