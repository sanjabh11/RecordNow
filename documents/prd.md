Online Song/Voice Recording Web App
1. Introduction
This document outlines the product requirements for developing a web application that enables users to record, upload, play, modify, and share short audio clips (songs or voice recordings) online. The application focuses on simplicity and user-friendliness, providing both basic and advanced features catering to a wide range of users.
2. Goals and Objectives
•	Core Goals:
o	Allow users to record audio directly from their browser for up to 120 seconds (2 minutes).
o	Enable users to upload existing audio files up to 120 seconds in duration and up to 60MB in size.
o	Provide playback functionality within the application.
o	Offer sharing options via unique links and embedding capabilities.
o	Implement voice modification features with various effects.
o	Ensure the app is accessible without requiring account creation.
o	Introduce a tiered subscription model (Free and Premium tiers).
•	Additional Objectives:
o	Integrate visual feedback during recording (e.g., waveform display, timer).
o	Support social media sharing with automatic embedding where possible.
o	Display usage limits and prompts for upgrading to Premium when limits are reached.
o	Provide user management and settings customization.
3. Target Audience
•	Individuals seeking a quick and easy way to record and share audio snippets.
•	Musicians wishing to share short demos or song ideas.
•	Users needing to send voice messages online.
•	Users interested in modifying their voice recordings with effects.
•	Organizations looking for an easy way to manage audio communications.
4. User Stories
•	As a user, I want to record my voice or music directly from the web browser for up to 2 minutes.
•	As a user, I want to upload an existing audio file (MP3/WAV/M4A) up to 60MB and 120 seconds.
•	As a user, I want to listen to my recording before sharing it.
•	As a user, I want to modify my voice recordings with different effects.
•	As a user, I want to share my recording via a unique link.
•	As a user, I want to embed my recording on websites or blogs.
•	As a user, I want recordings to automatically embed on supported social platforms when shared.
•	As a user, I want to see my usage limits and be prompted to upgrade when I reach them.
•	As a user, I want to use the app anonymously without creating an account.
5. Features
5.1 Core Features
•	Online Recording:
o	Record audio using the device's microphone.
o	Limit recordings to a maximum of 120 seconds (2 minutes).
o	Display visual feedback (waveform, timer) during recording.
•	Audio Upload:
o	Allow users to upload audio files (MP3, WAV, M4A) up to 60MB and 120 seconds.
o	Validate file format, size, and duration upon upload.
o	Support drag-and-drop functionality.
•	Voice Modification:
o	Provide multiple voice effects (e.g., pitch shift, echo, reverb, robotic, cartoon).
o	Allow real-time voice modification.
o	Enable users to preview effects before saving.
o	Save both original and modified recordings.
•	Audio Playback:
o	Play recorded or uploaded audio within the app.
o	Provide standard playback controls (play, pause, seek).
•	Sharing and Embedding:
o	Generate unique sharable links for each recording.
o	Integrate social media sharing buttons.
o	Provide embed codes for recordings.
o	Ensure recordings auto-embed on supported platforms (e.g., Twitter, Facebook).
•	Usage Limits and Subscription Model:
o	Free Tier: 
	Limit of 10 recordings per user.
	Display recording counter (e.g., "RECORDINGS 0/10").
	Prompt users to upgrade when limits are reached.
o	Premium Tier: 
	Unlimited recordings.
	Access to advanced voice effects.
	Extended storage options.
	Priority support.
	Ad-free experience.
•	#### Anonymous Storage System
•	- **Session-Based Storage**:
•	  - Generate unique anonymous ID for each browser session
•	  - Store up to 10 recordings per anonymous session
•	  - 30-day retention period for anonymous recordings
•	  - Clear storage usage indicators
•	
•	- **Anonymous User Management**:
•	  - No login required for basic features
•	  - Browser-based storage tracking
•	  - Anonymous ID persistence across sessions
•	  - Easy transition to registered accounts
5.2 Additional Features
•	User Management:
o	User authentication system (optional sign-in).
o	User dashboard to manage recordings.
o	Settings customization.
o	Access to recording history.
o	Ability to delete or retitle recordings.
•	Navigation and Interface:
o	Clear navigation menu with options like Home, Recordings, Upload, Settings, Help.
o	Search functionality for recordings.
o	Responsive design for desktop and mobile devices.
•	Extension Availability:
o	Provide browser extension for quick access (future consideration).
•	Affiliate Program:
o	Offer affiliate options for users to promote the app (future consideration).
6. Technical Requirements
6.1 Front-End
•	Technologies: HTML5, CSS3, JavaScript (ES6+), React.js
•	APIs and Libraries: 
o	MediaRecorder API: For audio recording. 
	Documentation
o	Web Audio API: For audio processing and visualization. 
	Documentation
o	HTML5 Audio Element: For audio playback. 
	Documentation
o	Wavesurfer.js (optional): For waveform visualization. 
	Documentation
o	React Router: For routing. 
	Documentation
o	UUID Library (uuid): For generating unique IDs. 
	Documentation
6.2 Back-End
•	Platform: Use Supabase for back-end services.
•	Services: 
o	Database: PostgreSQL via Supabase for storing metadata.
o	Storage: Supabase Storage for audio files.
o	Authentication: Supabase Auth for user management. 
	Supabase Documentation
6.3 Security and Privacy
•	Data Transmission: Secure via HTTPS.
•	Data Storage: Secure storage of audio files and metadata.
•	User Privacy: Compliance with relevant regulations (e.g., GDPR).
•	Anonymous Usage: Allow users to use the app without providing personal information.
6.4 Performance Requirements
•	Responsive UI: Optimize for various devices and screen sizes.
•	Audio Optimization: Efficient handling and streaming of audio files.
•	File Size Limits: Enforce file size limit of 60MB for uploads.
### 6.5 Anonymous Storage Requirements
- **Browser Storage**:
  - Local Storage for anonymous user identification
  - Session Storage for temporary data
  - IndexedDB for offline capabilities

- **Data Persistence**:
  - 30-day retention policy for anonymous recordings
  - Automatic cleanup of expired recordings
  - Storage quota management
  - Browser storage optimization
7. Architecture
•	Client-Server Model:
o	Client: React-based web application.
o	Server: Supabase handles database, storage, and authentication.
•	Component-Based Architecture:
o	Reusable UI components for recording, playback, uploading, voice modification, sharing.
•	API Integration:
o	Use Supabase client library (@supabase/supabase-js) for front-end and back-end communication.
•	Data Flow:
o	Users interact with the front-end components.
o	Audio files and metadata are uploaded to Supabase Storage and Database.
o	Recordings and user data are fetched from the back-end as needed.
## 7.4 Anonymous Storage Architecture
- **Client-Side Storage**:
  ```javascript
  {
    anonymousId: 'anon_uuid',
    sessionId: 'session_uuid',
    recordings: [{
      id: 'recording_uuid',
      createdAt: 'timestamp',
      expiresAt: 'timestamp'
    }]
  }
  ```

- **Server-Side Storage**:
  ```javascript
  {
    anonymousRecordings: {
      anonymousId: 'reference',
      sessionId: 'reference',
      metadata: 'object',
      retentionPeriod: '30_days'
    }
  }
8. Database Schema
8.1 Tables
recordings
•	id (UUID, Primary Key)
•	user_id (UUID, Foreign Key)
•	title (VARCHAR)
•	file_url (TEXT)
•	file_size (INTEGER, max 60MB)
•	duration (INTEGER, max 120 seconds)
•	file_format (VARCHAR, e.g., MP3, WAV, M4A)
•	is_modified (BOOLEAN, default: false)
•	voice_effect (VARCHAR)
•	created_at (TIMESTAMP WITH TIME ZONE, default: CURRENT_TIMESTAMP)
•	is_premium (BOOLEAN)
user_limits
•	user_id (UUID, Primary Key)
•	used_recordings (INTEGER, default: 0)
•	is_premium (BOOLEAN, default: false)
•	premium_until (TIMESTAMP WITH TIME ZONE)
•	total_storage_used (BIGINT, default: 0)
**anonymous_recordings**
```sql
CREATE TABLE anonymous_recordings (
    id UUID PRIMARY KEY,
    anonymous_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER CHECK (file_size <= 5000000), -- 5MB limit
    duration INTEGER CHECK (duration <= 120), -- 120 seconds limit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_modified BOOLEAN DEFAULT false,
    voice_effect VARCHAR(50),
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

CREATE INDEX idx_anonymous_id ON anonymous_recordings(anonymous_id);
CREATE INDEX idx_session_id ON anonymous_recordings(session_id);
CREATE INDEX idx_expires_at ON anonymous_recordings(expires_at);
9. API Endpoints
•	Recording Management:
o	POST /api/recordings/create: Create a new recording.
o	GET /api/recordings/list: List user's recordings.
o	DELETE /api/recordings/:id: Delete a specific recording.
•	Voice Modification:
o	POST /api/recordings/modify-voice: Apply voice effect to a recording.
o	GET /api/voice-effects/list: List available voice effects.
•	Premium Features:
o	POST /api/premium/upgrade: Upgrade to premium tier.
o	GET /api/premium/status: Get user's premium status.
•	User Management:
o	POST /api/auth/signup: User signup.
o	POST /api/auth/login: User login.
o	POST /api/auth/logout: User logout.
o	GET /api/user/profile: Get user profile.
•	// Anonymous recording management
•	POST /api/anonymous/recordings/create
•	GET /api/anonymous/recordings/list
•	DELETE /api/anonymous/recordings/:id
•	
•	// Anonymous session management
•	POST /api/anonymous/session/initialize
•	GET /api/anonymous/session/status
•	DELETE /api/anonymous/session/cleanup
•	```

10. User Interface Requirements
•	Home Page:
o	Options to "START RECORDING" and "SELECT AUDIO FILE".
o	Display recording counter (e.g., "RECORDINGS 0/10").
o	Show timer during recording/upload (e.g., "00:00/02:00").
•	Recording Interface:
o	Record button with microphone icon.
o	Timer display during recording.
o	Cancel option during recording.
•	Upload Interface:
o	Drag-and-drop area for file uploads.
o	Clear instructions on supported formats and size limit.
o	Validate and display errors for invalid files.
•	Playback Interface:
o	Audio player with standard controls.
o	Option to apply voice effects.
o	Save modified recordings.
•	Voice Modification Interface:
o	List of available voice effects.
o	Preview functionality.
o	Apply and save options.
•	Navigation Menu:
o	Home
o	Recordings
o	Upload
o	Voice Effects
o	Settings
o	Help
o	Sign In/Sign Out
•	Usage Limits and Upgrade Prompts:
o	Display current usage (e.g., "RECORDINGS 7/10").
o	Warning when approaching limit.
o	Prompt to upgrade to Premium when limit is reached.
o	Upgrade button/link accessible throughout the app.
•	Sharing Options:
o	Social media sharing buttons (Twitter, Facebook, LinkedIn, etc.).
o	Embed code for websites and blogs.
o	Direct link copying.
•	### 10.8 Anonymous Storage Interface
•	- **Storage Status Display**:
•	  - Show remaining storage space
•	  - Display recording count (e.g., "3/10 recordings used")
•	  - Indicate expiration dates for recordings
•	  - Warning notifications for approaching limits
•	
•	- **Session Management**:
•	  - Clear indication of anonymous session status
•	  - Option to convert to registered account
•	  - Storage cleanup tools
•	  - Expiration warnings
•	

11. Testing and Quality Assurance
•	Testing:
o	Unit tests for components and functions.
o	Integration tests for API interactions.
o	End-to-end tests simulating user flows.
•	Quality Assurance:
o	Code reviews.
o	Continuous integration (CI) pipeline.
o	User acceptance testing (UAT) with beta users.
•	### 11.4 Anonymous Storage Testing
•	- **Browser Storage Tests**:
•	  - Verify proper anonymous ID generation
•	  - Test storage limit enforcement
•	  - Validate retention period implementation
•	  - Check cleanup processes
•	
•	- **Data Persistence Tests**:
•	  - Verify recording persistence across sessions
•	  - Test automatic cleanup of expired recordings
•	  - Validate storage quota management
•	  - Check browser storage optimization

12. Future Enhancements
•	Extension Availability:
o	Develop browser extensions for quick access to recording features.
•	Affiliate Program:
o	Implement referral system and affiliate tracking.
•	Advanced Analytics:
o	Provide users with insights into recording statistics.
•	Collaboration Features:
o	Allow multiple users to collaborate on recordings.
•	Mobile Application:
o	Develop native mobile apps for iOS and Android.
•	### 12.6 Anonymous Storage Enhancements
•	- Extended retention periods for anonymous users
•	- Increased storage limits
•	- Advanced anonymous user analytics
•	- Enhanced privacy features
•	- Cross-device anonymous session syncing

