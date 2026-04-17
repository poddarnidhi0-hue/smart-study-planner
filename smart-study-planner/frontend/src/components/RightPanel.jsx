import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './RightPanel.css';

const DEADLINES = [
  { color: '#e05555', date: 'Apr 14', title: 'Math Assignment 3' },
  { color: '#e8a630', date: 'Apr 17', title: 'Physics Lab Report' },
  { color: '#5fba7d', date: 'Apr 20', title: 'CS Project Demo' },
  { color: '#b97de8', date: 'Apr 25', title: 'English Essay Final' },
];

export default function RightPanel({ subjects = [] }) {
  const { tasks } = useApp();
  const now = new Date();
  const [calYear, setCalYear]   = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const monthName = new Date(calYear, calMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  // Calculate real progress from tasks
  const getProgress = (subjectKey) => {
    const subjectTasks = tasks.filter(t => t.subject === subjectKey);
    if (subjectTasks.length === 0) return 0;
    const done = subjectTasks.filter(t => t.done).length;
    return Math.round((done / subjectTasks.length) * 100);
  };

  return (
    <aside className="right-panel">
      {/* Mini Calendar */}
      <div>
        <div className="panel-title">📆 {monthName}</div>
        <div className="mini-cal">
          <div className="mini-cal-header">
            <button className="cal-nav" onClick={prevMonth}>‹</button>
            <span>{monthName}</span>
            <button className="cal-nav" onClick={nextMonth}>›</button>
          </div>
          <MiniCalGrid year={calYear} month={calMonth} />
        </div>
      </div>

      {/* Subject Progress — dynamic */}
      <div>
        <div className="panel-title">📚 Subject Progress</div>
        <div className="subject-progress">
          {subjects.map(s => {
            const pct = getProgress(s.key);
            return (
              <div key={s.key} className="subj-row">
                <div className="subj-top">
                  <div className="subj-name">
                    <span className="subject-dot" style={{ background: s.color }} />
                    {s.label}
                  </div>
                  <span className="subj-pct">{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: s.color }} />
                </div>
              </div>
            );
          })}
          {subjects.length === 0 && (
            <div style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>No subjects added yet.</div>
          )}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <div className="panel-title">🔔 Upcoming Deadlines</div>
        <div className="upcoming-list">
          {DEADLINES.map((d, i) => (
            <div key={i} className="upcoming-item">
              <div className="upcoming-dot" style={{ background: d.color }} />
              <div className="upcoming-date">{d.date}</div>
              <div className="upcoming-title">{d.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="quote-card">
        "The secret of getting ahead is getting started."
        <div className="quote-author">— Mark Twain</div>
      </div>
    </aside>
  );
}

function MiniCalGrid({ year, month }) {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayLabels = ['S','M','T','W','T','F','S'];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="mini-cal-grid">
      {dayLabels.map((d, i) => <div key={i} className="cal-day-label">{d}</div>)}
      {cells.map((d, i) => (
        <div key={i} className={[
          'cal-day',
          d === null ? 'empty' : '',
          isCurrentMonth && d === today.getDate() ? 'today' : '',
        ].join(' ')}>
          {d || ''}
        </div>
      ))}
    </div>
  );
}