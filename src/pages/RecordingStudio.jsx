import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecordingHeader from '../components/recording/RecordingHeader';
import RecordingInterface from '../components/recording/RecordingInterface';
import PlaybackControls from '../components/recording/PlaybackControls';
import SharingOptions from '../components/recording/SharingOptions';
import RecordingsList from '../components/recording/RecordingsList';
import EffectsPanel from '../components/recording/EffectsPanel';
import SaveModal from '../components/recording/SaveModal.jsx';
import { toast } from '../components/ui/Toasts.jsx';
import { useAnonymousStorage } from '../hooks/useAnonymousStorage';
import '../styles/recording.css';

const RecordingStudio = () => {
  const [searchParams] = useSearchParams();
  const replyTo = searchParams.get('replyTo');
  const [recordingCount, setRecordingCount] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [error, setError] = useState(null);
  const { recordings, addRecording, getRecordingCount, storageError } = useAnonymousStorage();
  const [lastSavedRecording, setLastSavedRecording] = useState(null);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingSave, setPendingSave] = useState({ blob: null, duration: 0 });

  useEffect(() => {
    setRecordingCount(getRecordingCount());
  }, [getRecordingCount]);

  const handleRecordingComplete = async (blob) => {
    try {
      // Determine duration and confirm short notes
      const objectUrl = URL.createObjectURL(blob);
      const duration = await new Promise((resolve) => {
        const audio = new Audio();
        audio.src = objectUrl;
        audio.addEventListener('loadedmetadata', () => resolve(audio.duration || 0), { once: true });
        audio.addEventListener('error', () => resolve(0), { once: true });
      });
      if (duration < 2) {
        const proceed = window.confirm('This recording is very short (<2s). Do you still want to save it?');
        if (!proceed) {
          URL.revokeObjectURL(objectUrl);
          setIsRecording(false);
          return;
        }
      }
      URL.revokeObjectURL(objectUrl);

      // Open SaveModal to collect title/format before saving
      setPendingSave({ blob, duration: Math.round(duration) });
      setShowSaveModal(true);
      setIsRecording(false);
      setError(null);
    } catch (error) {
      console.error('Failed to save recording:', error);
      setError(error.message);
    }
  };

  const handleConfirmSave = async ({ title, format }) => {
    try {
      const defaultTitle = `Recording ${recordingCount + 1}`;
      const name = (title || defaultTitle).trim();
      const saved = await addRecording(pendingSave.blob, {
        type: 'recording',
        duration: pendingSave.duration,
        name,
        format
      });
      setAudioBlob(pendingSave.blob);
      setSelectedRecording({ ...saved, blob: pendingSave.blob });
      setLastSavedRecording(saved);
      setShowPrivacyNotice(true);
      setRecordingCount(getRecordingCount());
      setShowSaveModal(false);
      setPendingSave({ blob: null, duration: 0 });
      toast('Saved locally');
    } catch (e) {
      console.error('Save failed:', e);
      setError('Failed to save');
      setShowSaveModal(false);
    }
  };

  const handleRecordingSelect = (recording) => {
    if (recording && recording.blob) {
      setSelectedRecording(recording);
      setAudioBlob(recording.blob);
    }
  };

  return (
    <div className="recording-studio">
      <RecordingHeader recordingCount={recordingCount} />
      
      <main className="recording-interface">
        {(error || storageError) && (
          <div className="error-message">
            {error || storageError}
          </div>
        )}
        {replyTo && (
          <div className="info-banner">
            Responding to note: {replyTo}
          </div>
        )}
        {showPrivacyNotice && (
          <div className="info-banner">
            This note is stored locally on this browser only. Sharing uses a local link (/n/:id) that works on this device. No remote upload or account is used.
            <button className="secondary-button" onClick={() => setShowPrivacyNotice(false)} style={{ marginLeft: 12 }}>Dismiss</button>
          </div>
        )}
        
        <div className="search-bar">
          <input type="search" placeholder="Search reverbs" />
          <button className="cancel-button">CANCEL</button>
        </div>

        <RecordingInterface 
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onRecordingComplete={handleRecordingComplete}
          recordingCount={recordingCount}
        />
        
        {(audioBlob || selectedRecording) && (
          <>
            <PlaybackControls 
              audioBlob={selectedRecording?.blob || audioBlob} 
            />
            <EffectsPanel disabled={!(selectedRecording?.blob || audioBlob)} />
            {(selectedRecording || lastSavedRecording) && (
              <SharingOptions 
                recording={selectedRecording || lastSavedRecording}
              />
            )}
          </>
        )}

        <RecordingsList onSelect={handleRecordingSelect} />
      </main>
      <SaveModal 
        open={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
        onConfirm={handleConfirmSave}
        defaultTitle={`Recording ${recordingCount + 1}`}
        duration={pendingSave.duration}
      />
    </div>
  );
};

export default RecordingStudio;