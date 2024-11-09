import React, { useState } from 'react';

const SharingOptions = ({ audioBlob }) => {
  const [copied, setCopied] = useState(false);
  const [embedCode, setEmbedCode] = useState('');

  const generateShareableLink = () => {
    // In a real implementation, this would upload the audio and return a shareable link
    return 'https://recordnow.com/recording/123'; // Placeholder
  };

  const generateEmbedCode = () => {
    const link = generateShareableLink();
    return `<iframe src="${link}/embed" width="100%" height="160" frameborder="0"></iframe>`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = (platform) => {
    const link = generateShareableLink();
    const text = 'Check out my recording on RecordNow!';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="sharing-options">
      <h3>Share Your Recording</h3>
      <div className="share-buttons">
        <button 
          className="copy-link"
          onClick={() => copyToClipboard(generateShareableLink())}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        
        <button 
          className="embed-code"
          onClick={() => {
            const code = generateEmbedCode();
            setEmbedCode(code);
            copyToClipboard(code);
          }}
        >
          Get Embed Code
        </button>

        <div className="social-share">
          <button 
            className="twitter"
            onClick={() => handleShare('twitter')}
          >
            Share on Twitter
          </button>
          <button 
            className="facebook"
            onClick={() => handleShare('facebook')}
          >
            Share on Facebook
          </button>
          <button 
            className="linkedin"
            onClick={() => handleShare('linkedin')}
          >
            Share on LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharingOptions; 