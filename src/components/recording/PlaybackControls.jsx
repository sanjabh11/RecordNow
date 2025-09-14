import React, { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const PlaybackControls = ({ audioBlob }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [progress, setProgress] = useState(0); // 0..1
  const [volume, setVolume] = useState(1); // 0..1
  const [selectedEffect, setSelectedEffect] = useState(null);
  const [error, setError] = useState(null);
  
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const audioUrlRef = useRef(null);
  const lastUiUpdate = useRef(0);
  const isSeekingRef = useRef(false);

  // Initialize WaveSurfer once
  useEffect(() => {
    try {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'var(--primary-color)',
        progressColor: 'var(--secondary-color)',
        cursorWidth: 1,
        height: 80,
        responsive: true,
        normalize: true,
        minPxPerSec: 50,
        barWidth: 2,
        barGap: 1,
        interact: true,
      });

      wavesurfer.current.on('ready', () => {
        const d = wavesurfer.current.getDuration();
        setDuration(formatTime(isFinite(d) ? d : 0));
        setProgress(0);
        wavesurfer.current.setVolume(volume);
      });

      wavesurfer.current.on('audioprocess', () => {
        // Throttle UI updates to ~5fps to avoid layout jitter on long playback
        const now = performance.now();
        if (now - lastUiUpdate.current < 300) return;
        lastUiUpdate.current = now;
        const t = wavesurfer.current.getCurrentTime();
        const d = wavesurfer.current.getDuration() || 1;
        setCurrentTime(formatTime(t));
        if (!isSeekingRef.current) {
          setProgress(Math.max(0, Math.min(1, t / d)));
        }
      });

      wavesurfer.current.on('play', () => setIsPlaying(true));
      wavesurfer.current.on('pause', () => setIsPlaying(false));

      wavesurfer.current.on('error', (err) => {
        // Suppress console noise for AbortError (harmless during rapid unmounts or reloads)
        const isAbort = err && (err.name === 'AbortError' || `${err}`.includes('AbortError'));
        if (!isAbort) {
          console.error('WaveSurfer error:', err);
        }
        // Avoid surfacing AbortError to users (common on rapid unmounts)
        if (!isAbort) {
          setError('Failed to load audio. Please try again.');
        }
      });

      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
        setProgress(1);
      });
    } catch (err) {
      console.error('WaveSurfer initialization error:', err);
      setError('Failed to initialize audio player');
    }

    return () => {
      // Cleanup instance on unmount
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, []);

  // Load audio when blob changes
  useEffect(() => {
    if (!wavesurfer.current || !audioBlob) return;
    try {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = URL.createObjectURL(audioBlob);
      wavesurfer.current.load(audioUrlRef.current).catch((err) => {
        // Catch promise rejection from load
        const isAbort = err && (err.name === 'AbortError' || `${err}`.includes('AbortError'));
        if (!isAbort) {
          console.error('WaveSurfer load error:', err);
          setError('Failed to load audio file');
        }
      });
      setError(null);
    } catch (err) {
      console.error('Audio loading error:', err);
      setError('Failed to load audio file');
    }
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, [audioBlob]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = (e) => {
    e.preventDefault(); // Prevent default link behavior
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(wavesurfer.current.isPlaying());
    }
  };

  const onSeek = (e) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (wavesurfer.current) {
      wavesurfer.current.seekTo(value);
    }
  };

  const onSeekStart = () => { isSeekingRef.current = true; };
  const onSeekEnd = () => { isSeekingRef.current = false; };

  const onVolume = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(value);
    }
  };

  const applyEffect = (effect) => {
    setSelectedEffect(effect);
    // Voice effect implementation will go here
  };

  return (
    <div className="playback-controls">
      {error && <div className="error-message">{error}</div>}
      <div className="audio-player">
        <button 
          className="play-pause-button" 
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="waveform-playback" ref={waveformRef}></div>
        <div className="time-display" style={{ fontFamily: 'monospace', minWidth: `${(duration || '00:00').length * 1.2}ch`, textAlign: 'right' }}>
          {currentTime} / {duration}
        </div>
      </div>
      <div className="player-controls-row">
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onChange={onSeek}
          onMouseDown={onSeekStart}
          onMouseUp={onSeekEnd}
          onTouchStart={onSeekStart}
          onTouchEnd={onSeekEnd}
          aria-label="Seek"
          className="seekbar"
        />
        <div className="volume">
          <span aria-hidden>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolume}
            aria-label="Volume"
          />
        </div>
      </div>
      <div className="modification-controls">
        <select 
          value={selectedEffect || ''}
          onChange={(e) => applyEffect(e.target.value)}
          className="effect-select"
        >
          <option value="">Select Effect</option>
          <option value="pitch">Pitch Shift</option>
          <option value="echo">Echo</option>
          <option value="reverb">Reverb</option>
          <option value="robot">Robot Voice</option>
        </select>
        
        <button className="save-button">
          Save Recording
        </button>
      </div>
    </div>
  );
};

export default PlaybackControls; 