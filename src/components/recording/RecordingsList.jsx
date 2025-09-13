import React, { useMemo, useState } from 'react';
import { useAnonymousStorage } from '../../hooks/useAnonymousStorage';

const RecordingsList = ({ onSelect }) => {
  const { recordings, deleteRecording, getRecordingBlob, updateRecording } = useAnonymousStorage();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handlePlay = (e, recording) => {
    e.preventDefault(); // Prevent default link behavior
    const blob = getRecordingBlob(recording);
    if (blob) {
      onSelect({ ...recording, blob });
    }
  };

  const handleRename = async (recording) => {
    const current = recording.name || 'Untitled';
    const name = (window.prompt('Rename recording', current) || '').trim();
    if (!name || name === current) return;
    try {
      await updateRecording(recording.id, { name });
    } catch (e) {
      // best-effort; errors already logged in hook
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? recordings.filter(r => (r.name || '').toLowerCase().includes(q)) : recordings.slice();
    const by = (a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'duration') return (b.duration || 0) - (a.duration || 0);
      return 0;
    };
    return base.sort(by);
  }, [recordings, query, sort]);

  return (
    <div className="recordings-list">
      <h2>Your Recordings</h2>
      <div className="list-toolbar">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="secondary-button" style={{ marginLeft: 8 }}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="duration">Duration</option>
        </select>
      </div>
      {recordings.length === 0 ? (
        <div className="no-recordings glass" style={{ padding: 24, borderRadius: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎙️</div>
          <p>No recordings yet — tap Start Recording or upload a file.</p>
        </div>
      ) : (
        <div className="recordings-grid">
          {filtered.map((recording) => (
            <div key={recording.id} className="recording-card">
              <div className="recording-info">
                <h3>{recording.name || 'Untitled'}</h3>
                <p>
                  {formatDate(recording.createdAt)} • {(recording.duration || 0)}s • {(Math.round((recording.size || 0)/1024))} KB
                </p>
                <p className="expiry-notice">
                  Expires in {getDaysUntilExpiry(recording.expiresAt)} days
                </p>
              </div>
              <div className="recording-actions">
                <button 
                  onClick={(e) => handlePlay(e, recording)} 
                  className="play-button"
                >
                  Play
                </button>
                <button
                  onClick={() => handleRename(recording)}
                  className="rename-button"
                >
                  Rename
                </button>
                <button
                  onClick={() => onSelect && onSelect({ ...recording, blob: getRecordingBlob(recording) })}
                  className="secondary-button"
                >
                  Effects
                </button>
                <a href={`/n/${recording.id}`} className="secondary-button" style={{ textDecoration: 'none' }}>
                  Share
                </a>
                <button 
                  onClick={() => deleteRecording(recording.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordingsList; 