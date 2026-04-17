import React, { useMemo } from 'react';
import { useApp, SUBJECT_COLORS } from '../context/AppContext';
import './Planner.css';

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Planner() {
  const { tasks } = useApp();

  // Build the current week (Sun → Sat)
  const week = useMemo(() => {
    const today = new Date();
    const day   = today.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - day + i);
      return d;
    });
  }, []);

  const todayDate = new Date().toDateString();

  // Group tasks by date string YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (!map[t.due]) map[t.due] = [];
      map[t.due].push(t);
    });
    return map;
  }, [tasks]);

  const toKey = (d) => d.toISOString().split('T')[0];

  return (
    <div className="page-enter">
      <div className="greeting">
        <h1>Weekly Planner</h1>
        <p>Your study schedule for this week at a glance.</p>
      </div>

      <div className="week-grid">
        {week.map((d, i) => {
          const isToday   = d.toDateString() === todayDate;
          const dayTasks  = tasksByDate[toKey(d)] || [];
          return (
            <div key={i} className="day-col">
              <div className={`day-header ${isToday ? 'today' : ''}`}>
                {DAY_NAMES[i]}
              </div>
              <div className={`day-num ${isToday ? 'today' : ''}`}>
                {d.getDate()}
              </div>
              {dayTasks.map(t => {
                const sc = SUBJECT_COLORS[t.subject] || SUBJECT_COLORS.Math;
                return (
                  <div
                    key={t.id}
                    className={`event-block ${t.done ? 'done' : ''}`}
                    style={{
                      background: `${sc.dot}18`,
                      borderLeftColor: sc.dot,
                      color: sc.dot,
                    }}
                    title={t.title}
                  >
                    {t.title.length > 22 ? t.title.slice(0,22) + '…' : t.title}
                  </div>
                );
              })}
              {dayTasks.length === 0 && (
                <div className="no-events">—</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
