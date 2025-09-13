# PBI-001: Local Sharing and Note Page (Local-First)

## Scope
- Implement local shareable links using route `/n/:id`
- Add `NotePage` for playback, retitle, delete, and respond CTA
- Replace placeholder link logic in `SharingOptions`
- Initialize anonymous ID locally and add storage helpers (get/update by id)
- Fix broken links in `Home.jsx`

## Tasks
- T1: Add `NotePage.jsx` and route `/n/:id` (COMPLETED)
- T2: Update `useAnonymousStorage.jsx` with `getRecordingById`, `updateRecording`, `anonymousId` init (COMPLETED)
- T3: Update `SharingOptions.jsx` to use real links based on `recording.id` (COMPLETED)
- T4: Update `RecordingStudio.jsx` to prompt for title, confirm very short notes, and pass `recording` to sharing/playback (COMPLETED)
- T5: Fix `Home.jsx` upload link -> `/record` (COMPLETED)
- T6: Add “Responding to” banner on `/record` when `replyTo` query param is present (COMPLETED)
- T7: Add local delete token to saved notes and expose Copy Delete Link in `SharingOptions` (COMPLETED)
- T8: Add delete-via-link flow on `NotePage` when a valid `delete_token` is present (COMPLETED)
- T9: Add search and retitle capabilities to `RecordingsList` (COMPLETED)
- T10: Improve mic-permission guidance and add unsaved-recording guard (COMPLETED)

## File Map
- Add: `src/pages/NotePage.jsx`
- Modify: `src/App.jsx`, `src/hooks/useAnonymousStorage.jsx`, `src/components/recording/SharingOptions.jsx`, `src/pages/RecordingStudio.jsx`, `src/pages/Home.jsx`
- Modify: `src/components/recording/RecordingsList.jsx`, `src/components/recording/RecordingInterface.jsx`, `src/pages/NotePage.jsx` (delete token)

## Status Log
- 2025-09-12 16:16 IST: Plan approved; initializing implementation
- 2025-09-12 16:17 IST: Created progress log; starting T1
- 2025-09-12 16:25 IST: Added `NotePage.jsx` and route; replaced placeholder links; added storage helpers; fixed Home link; added wavesurfer dependency; added privacy note and noindex on `NotePage`; improved Recording flow with title prompt and short-note confirm; added respond banner.
- 2025-09-12 18:05 IST: Added delete token generation; SharingOptions shows Copy Delete Link; NotePage supports delete via link; added search + retitle in RecordingsList; improved mic-permission help and added beforeunload guard during recording.

## Test Plan
- Recording flow
  - Allow mic; record for >2s; on stop, prompt for title; save and display in list.
  - Record for <2s; confirm dialog appears; cancel prevents save.
- Sharing
  - After save, Copy Link shows `/n/:id` and opens a note page that plays audio.
  - Copy Embed produces iframe with same `/n/:id` link.
- Note Page
  - Shows title input; change and blur/click save updates title and persists.
  - Delete removes recording; navigating back to `/n/:id` shows not found.
  - “Respond” links to `/record?replyTo=:id` and banner appears.
- Upload UI
  - Drag or select MP3/WAV/M4A/AAC under 60MB and under 2 minutes; saves like a recording.
