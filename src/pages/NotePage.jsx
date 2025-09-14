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
    setDisplayName,
    getDisplayName,
    initialized,
  } = useAnonymousStorage();

  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(null);
  const [blob, setBlob] = useState(null);
  const [error, setError] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [validDeleteToken, setValidDeleteToken] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

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

  const addComment = async () => {
    const text = (newComment || '').trim();
    if (!text || !recording) return;
    const entry = { text, ts: Date.now(), by: identity || 'Anonymous' };
    const next = [...comments, entry];
    try {
      await updateRecording(recording.id, { comments: next });
      setComments(next);
      setNewComment('');
      toast('Comment added');
    } catch (e) {
      toast('Failed to add comment');
    }
  };

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
        setComments(Array.isArray(rec.comments) ? rec.comments : []);
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
  const [identity, setIdentity] = useState('');
  useEffect(() => {
    setIdentity(getDisplayName() || recording?.ownerName || '');
  }, [recording]);

  const shareMessage = useMemo(() => {
    const home = window.location.origin + '/';
    const who = identity ? `🎧 ${identity} shared a recording:` : '🎧 Here is a recording:';
    const app = `✨ Try RecordNow: ${home}`;
    const copyright = '© Ignite Consulting';
    return `${shareUrl}\n\n${who}\n${app}\n${copyright}`;
  }, [identity, shareUrl]);

  const handleShare = (platform) => {
    const link = shareUrl;
    const text = shareMessage;
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    };
    const w = window.open(shareUrls[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
    if (w) w.opener = null;
  };

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
        {recording?.ownerName && (
          <div style={{ marginTop: 6, color: 'var(--text-muted)', fontSize: 13 }}>
            Shared by <strong>{recording.ownerName}</strong>
          </div>
        )}
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

      {blob && (
        <div className="share-row" style={{ marginTop: 8 }}>
          <a
            className="secondary-button"
            href={URL.createObjectURL(blob)}
            download={`${(recording?.name || 'recording').replace(/\s+/g,'_')}.webm`}
          >
            Download (WEBM)
          </a>
        </div>
      )}

      <section className="share-section">
        <h3>Share</h3>
        <div className="share-row">
          <input
            className="title-input"
            placeholder="Your name (optional)"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            onBlur={async () => {
              try {
                setDisplayName(identity.trim());
                if (recording) {
                  await updateRecording(recording.id, { ownerName: identity.trim() });
                  setRecording({ ...recording, ownerName: identity.trim() });
                }
                toast('Saved your name');
              } catch {}
            }}
          />
        </div>
        <div className="share-row">
          <div className="share-preview">
            <div><strong>{identity || 'Someone'}</strong> shared a recording.</div>
            <div><a href={shareUrl} target="_blank" rel="noopener noreferrer">{shareUrl}</a></div>
            <div style={{ marginTop: 8 }}>Do you want to use this app? <a href="/" rel="noopener noreferrer">{window.location.origin}/</a></div>
          </div>
          <button
            className="secondary-button"
            onClick={() => { navigator.clipboard.writeText(shareMessage); toast('Copied message'); }}
          >
            Copy Message
          </button>
        </div>
        <div className="share-row" style={{ gap: 8 }}>
          <button className="secondary-button" onClick={() => handleShare('whatsapp')}>WhatsApp</button>
          <button className="secondary-button" onClick={() => handleShare('twitter')}>Twitter</button>
          <button className="secondary-button" onClick={() => handleShare('facebook')}>Facebook</button>
          <button className="secondary-button" onClick={() => handleShare('linkedin')}>LinkedIn</button>
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

      <section className="comments-section" style={{ marginTop: 16 }}>
        <h3>Comments</h3>
        <div className="share-row">
          <input
            className="title-input"
            placeholder="Write a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={async (e) => { if (e.key === 'Enter') await addComment(); }}
          />
          <button className="secondary-button" onClick={async () => { await addComment(); }}>Post</button>
        </div>
        <div className="comments-list" style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          {comments.length === 0 ? (
            <div className="glass" style={{ padding: 12, borderRadius: 12, color: 'var(--text-muted)' }}>No comments yet</div>
          ) : comments.map((c, i) => (
            <div key={i} className="glass" style={{ padding: 12, borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(c.ts).toLocaleString()} — {c.by || 'Anonymous'}</div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NotePage;
