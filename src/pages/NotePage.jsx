import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import PlaybackControls from '../components/recording/PlaybackControls';
import { useAnonymousStorage } from '../hooks/useAnonymousStorage';
import { toast } from '../components/ui/Toasts.jsx';

const NotePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    recordings,
    getRecordingById,
    getRecordingBlob,
    updateRecording,
    deleteRecording,
    initialized,
  } = useAnonymousStorage();

  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(null);
  const [blob, setBlob] = useState(null);
  const [error, setError] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [validDeleteToken, setValidDeleteToken] = useState(false);

  // Ensure note pages are not indexed
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    const prev = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex');
    return () => {
      // restore if needed
      if (prev) meta.setAttribute('content', prev);
      else meta.parentElement && meta.parentElement.removeChild(meta);
    };
  }, []);

  // Load recording (try fast path from state, then direct IndexedDB read)
  useEffect(() => {
    let mounted = true;
    const token = searchParams.get('delete_token');
    const load = async () => {
      try {
        if (!initialized) return;
        // Try from in-memory list first
        const fromList = recordings.find(r => r.id === id);
        let rec = fromList;
        if (!rec && getRecordingById) {
          rec = await getRecordingById(id);
        }
        if (!mounted) return;
        if (!rec) {
          setError('Recording not found');
          setLoading(false);
          return;
        }
        setRecording(rec);
        setEditingTitle(rec.name || 'Untitled');
        const b = getRecordingBlob(rec);
        setBlob(b);
        setLoading(false);
        // Validate delete token if present
        if (token && rec.deleteToken && token === rec.deleteToken) {
          setValidDeleteToken(true);
        }
      } catch (e) {
        if (!mounted) return;
        setError('Failed to load recording');
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id, recordings, initialized]);

  const shareUrl = useMemo(() => `${window.location.origin}/n/${id}`, [id]);
  const embedCode = useMemo(
    () => `<iframe src="${shareUrl}" width="100%" height="160" frameborder="0"></iframe>`,
    [shareUrl]
  );

  const onSaveTitle = async () => {
    if (!recording) return;
    const newTitle = (editingTitle || '').trim();
    if (!newTitle || newTitle === recording.name) return;
    setSaving(true);
    try {
      await updateRecording(recording.id, { name: newTitle });
      setRecording({ ...recording, name: newTitle });
    } catch (e) {
      // noop: surface error minimal
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!recording) return;
    const ok = window.confirm('Delete this recording permanently from this browser?');
    if (!ok) return;
    await deleteRecording(recording.id);
    navigate('/record');
  };

  const onDeleteViaToken = async () => {
    if (!validDeleteToken || !recording) return;
    await deleteRecording(recording.id);
    navigate('/record');
  };

  if (loading) return <div className="note-page"><p>Loading...</p></div>;
  if (error) return (
    <div className="note-page">
      <p className="error-message">{error}</p>
      <Link to="/record" className="primary-button">Go to Recorder</Link>
    </div>
  );

  return (
    <div className="note-page">
      <header className="note-header">
        {validDeleteToken && (
          <div className="info-banner">
            Valid delete link detected. You can delete this note using the button below.
          </div>
        )}
        <div className="title-row">
          <input
            className="title-input"
            type="text"
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={onSaveTitle}
            placeholder="Title your note"
          />
          <button className="secondary-button" onClick={onSaveTitle} disabled={saving}>
            {saving ? 'Saving...' : 'Save Title'}
          </button>
        </div>
        <div className="note-actions">
          <button
            className="danger-button"
            onClick={onDelete}
          >
            Delete
          </button>
          {validDeleteToken && (
            <button
              className="danger-button"
              onClick={onDeleteViaToken}
            >
              Delete via Link
            </button>
          )}
          <Link className="secondary-button" to={`/record?replyTo=${id}`}>
            Respond
          </Link>
        </div>
      </header>

      {blob ? (
        <PlaybackControls audioBlob={blob} />
      ) : (
        <p className="error-message">Unable to load audio</p>
      )}

      <section className="share-section">
        <h3>Share</h3>
        <div className="share-row">
          <input className="share-link" readOnly value={shareUrl} />
          <button
            className="secondary-button"
            onClick={() => { navigator.clipboard.writeText(shareUrl); toast('Copied link'); }}
          >
            Copy Link
          </button>
        </div>
        <div className="share-row">
          <textarea className="embed-code" readOnly value={embedCode} rows={3} />
          <button
            className="secondary-button"
            onClick={() => { navigator.clipboard.writeText(embedCode); toast('Copied embed code'); }}
          >
            Copy Embed Code
          </button>
        </div>
        <p className="privacy-note">
          This is a local-only preview link. It works on this device/browser where the note is saved. No account or remote upload is used.
        </p>
      </section>
    </div>
  );
};

export default NotePage;
