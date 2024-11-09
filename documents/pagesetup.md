Homepage Instructions for RecordNow
Page 1: Landing Page
Header Section
<header>
    <div class="logo">RecordNow</div>
    <nav>
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#help">Help</a></li>
            <li><a href="/record" class="cta-button">Start Recording</a></li>
        </ul>
    </nav>
</header>

Hero Section
 
html
Copy Code
<section class="hero">
    <h1>Record, Share, Connect</h1>
    <p>Free online voice recorder - No registration required</p>
    <div class="cta-buttons">
        <a href="/record" class="primary-button">Start Recording</a>
        <a href="/upload" class="secondary-button">Upload Audio</a>
    </div>
</section>
Key Features Section
 
html
Copy Code
<section class="features">
    <h2>Why Choose RecordNow?</h2>
    <div class="feature-grid">
        <div class="feature-card">
            <icon>⏱️</icon>
            <h3>2-Minute Recordings</h3>
            <p>Record up to 120 seconds of high-quality audio</p>
        </div>
        <div class="feature-card">
            <icon>🎤</icon>
            <h3>Easy Sharing</h3>
            <p>Share instantly via link or embed</p>
        </div>
        <div class="feature-card">
            <icon>🔒</icon>
            <h3>No Sign-up Required</h3>
            <p>Start recording immediately</p>
        </div>
    </div>
</section>
Footer
 
html
Copy Code
<footer>
    <div class="footer-content">
        <p>© 2024 RecordNow by Ignite Consulting. All rights reserved.</p>
        <div class="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="/contact">Contact</a>
        </div>
    </div>
</footer>
Page 2: Recording Interface
Header Section
 
html
Copy Code
<header class="recording-header">
    <div class="logo">RecordNow</div>
    <div class="recording-counter">
        <span>RECORDINGS: <span id="count">0</span>/10</span>
        <a href="/premium" class="upgrade-link">FOR UNLIMITED USAGE SUBSCRIBE TO PREMIUM</a>
    </div>
</header>
Main Recording Interface
 
html
Copy Code
<main class="recording-interface">
    <div class="search-bar">
        <input type="search" placeholder="Search reverbs">
        <button class="cancel-button">CANCEL</button>
    </div>

    <div class="recording-options">
        <!-- Recording Section -->
        <section class="record-section">
            <h2>START RECORDING</h2>
            <button class="record-button">
                <i class="microphone-icon"></i>
            </button>
            <div class="timer">00:00/02:00</div>
        </section>

        <!-- Upload Section -->
        <section class="upload-section">
            <h2>OR</h2>
            <div class="upload-area">
                <h3>SELECT AUDIO FILE</h3>
                <p>DROP YOUR MP3/WAV/M4A HERE. 60MB LIMIT</p>
                <input type="file" accept=".mp3,.wav,.m4a">
            </div>
        </section>
    </div>
</main>
Playback Controls
 
html
Copy Code
<div class="playback-controls">
    <div class="audio-player">
        <button class="play-pause"></button>
        <div class="progress-bar"></div>
        <div class="time-display">00:00</div>
    </div>
    <div class="modification-controls">
        <button class="effect-button">Voice Effects</button>
        <button class="save-button">Save Recording</button>
    </div>
</div>
Sharing Options
 
html
Copy Code
<div class="sharing-options">
    <h3>Share Your Recording</h3>
    <div class="share-buttons">
        <button class="copy-link">Copy Link</button>
        <button class="embed-code">Get Embed Code</button>
        <div class="social-share">
            <button class="twitter">Twitter</button>
            <button class="facebook">Facebook</button>
            <button class="linkedin">LinkedIn</button>
        </div>
    </div>
</div>
CSS Styling Notes
 
css
Copy Code
/* Key styling considerations */
:root {
    --primary-color: #506078;
    --secondary-color: #3db1e2;
    --accent-color: #7afff8;
    --text-color: #333;
    --background-color: #fff;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
    /* Mobile-specific styles */
}

/* Accessibility */
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
}

