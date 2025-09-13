# RecordNow (Local-First)

A fast, privacy-focused in-browser voice recorder with instant local share links. No registration required. This implementation prioritizes local browser storage (IndexedDB) and anonymous usage. Remote accounts and uploads are intentionally out of scope for this milestone.

## Features (Current)
- Anonymous recording via MediaRecorder with 2-minute cap.
- Drag-and-drop audio upload (MP3/WAV/M4A/AAC), 60MB, <= 2 minutes.
- Local persistence with IndexedDB, per-note delete token, and anonymous ID.
- Shareable local link: `/n/:id` (works on the same device/browser).
- Note page with playback, retitle, delete, and Respond CTA.
- Library view with search and rename.
- Premium UI: hero with glassmorphism, responsive layout, smooth hover, fade-in on scroll.

## Out of Scope (Deferred)
- Remote uploads, object storage, CDN, OG/Twitter cards, oEmbed endpoint.
- Remote authentication and cross-device library sync.
- Transcription and content safety backend.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install and Run (Dev)
```bash
npm install
npm run dev
```
Open the URL shown by Vite (typically http://localhost:5173/).

### Build
```bash
npm run build
npm run preview
```

## Usage Tips
- Recording requires granting microphone access in your browser.
- Local share links work only in the same device/browser where the note is saved.
- Use the Copy Delete Link for local deletion via URL (no backend).

## Project Structure (Key)
- `src/pages/RecordingStudio.jsx`: main recorder and upload UI
- `src/pages/NotePage.jsx`: per-note playback, retitle, delete, respond
- `src/components/recording/…`: UI components (record, playback, share, list)
- `src/hooks/useAnonymousStorage.jsx`: IndexedDB storage helpers
- `src/utils/analytics.js`: local no-op analytics
- `src/styles/main.css`: global styles (hero, glassmorphism, animations)

## Security Notes
- External share windows use `noopener,noreferrer` and `opener=null` to prevent tab-nabbing.
- Note pages set `noindex` to avoid indexing.
- Recommended production CSP (if hosted):
  - `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`
  - Adjust for any CDNs or APIs when added.

## Implementation Status
- Implemented: local recording/upload, share link + embed, note page actions, delete token, search/rename, UI overhaul.
- Pending: remote upload + CDN + OG/oEmbed, remote authentication and cross-device sync, transcription, moderation.

## Developer Notes
- The IndexedDB schema uses store `recordings` keyed by `id`. Each record stores `audioData` (Base64), `ownerId`, `deleteToken`, metadata like `name`, `size`, `createdAt`, `expiresAt`.
- Avoid changing the store name without a migration.
- Keep UI changes modular; prefer small components under `src/components/`.

## Future Improvements
- Move share model to backend with signed URLs + note metadata API.
- Add OG/Twitter preview and oEmbed endpoint for embedding.
- Add transcription pipeline and search over transcripts.
- Implement authentication and library sync.

## Deployment (Netlify)

This app is configured for Netlify hosting.

1) Build
```bash
npm run build
```

2) Deploy options
- Netlify CLI:
  - Install: `npm i -g netlify-cli`
  - Run: `netlify deploy --prod --dir=dist`
- Netlify UI:
  - Create a new site from Git, select this repo
  - Build command: `npm run build`
  - Publish directory: `dist`

3) SPA routing
- `netlify.toml` includes a SPA fallback redirect so deep links like `/n/:id` resolve to `index.html`.

4) Security headers
- `netlify.toml` sets common security headers; adjust CSP at the platform level if required by your asset/CDN setup.

5) Environment files
- `.env` files are gitignored by default; see `.env.example` for placeholders. No environment variables are required for the local-first build.
