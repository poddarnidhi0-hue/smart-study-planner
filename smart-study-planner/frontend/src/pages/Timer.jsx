import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sessionService } from '../services/api';
import './Timer.css';

const MODES = [
  { key: 'pomodoro', label: 'Pomodoro',    mins: 25 },
  { key: 'short',    label: 'Short Break', mins: 5  },
  { key: 'long',     label: 'Long Break',  mins: 15 },
  { key: 'custom',   label: 'Custom (45m)',mins: 45 },
];

export default function Timer() {
  const [mode, setMode]               = useState('pomodoro');
  const [seconds, setSeconds]         = useState(25 * 60);
  const [running, setRunning]         = useState(false);
  const [sessions, setSessions]       = useState(0); // completed
  const intervalRef = useRef(null);

  const currentMode = MODES.find(m => m.key === mode);

  const tick = useCallback(() => {
    setSeconds(s => {
      if (s <= 1) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setSessions(prev => Math.min(4, prev + 1));
        // Save session to backend
        sessionService.create({ mode, completedAt: new Date().toISOString() }).catch(() => {});
        return currentMode.mins * 60; // reset
      }
      return s - 1;
    });
  }, [mode, currentMode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const toggle = () => setRunning(r => !r);

  const reset = () => {
    setRunning(false);
    setSeconds(currentMode.mins * 60);
  };

  const skip = () => {
    setRunning(false);
    setSessions(prev => Math.min(4, prev + 1));
    setSeconds(currentMode.mins * 60);
  };

  const switchMode = (m) => {
    setRunning(false);
    setMode(m.key);
    setSeconds(m.mins * 60);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const pct = 1 - seconds / (currentMode.mins * 60);

  // SVG ring
  const R = 70, C = 2 * Math.PI * R;
  const offset = C * (1 - pct);

  return (
    <div className="page-enter timer-page">
      <div className="timer-label-top">Focus Session</div>

      <div className="mode-pills-row">
        {MODES.map(m => (
          <button
            key={m.key}
            className={`mode-pill ${mode === m.key ? 'active' : ''}`}
            onClick={() => switchMode(m)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Circular Progress */}
      <div className="timer-ring-wrap">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={R} fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle
            cx="90" cy="90" r={R} fill="none"
            stroke="var(--amber)" strokeWidth="10"
            strokeDasharray={C} strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 0.9s linear' }}
          />
        </svg>
        <div className="timer-display">{mm}:{ss}</div>
      </div>

      <div className="timer-controls">
        <button className="btn btn-ghost" onClick={reset}>↺ Reset</button>
        <button className="btn btn-primary timer-main-btn" onClick={toggle}>
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button className="btn btn-ghost" onClick={skip}>⏭ Skip</button>
      </div>

      <div className="sessions-row">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={`session-dot ${i < sessions ? 'done' : ''}`} />
        ))}
      </div>
      <p className="session-hint">
        Session {Math.min(sessions + 1, 4)} of 4 · {Math.max(0, 3 - sessions)} more until long break
      </p>
    </div>
  );
}
