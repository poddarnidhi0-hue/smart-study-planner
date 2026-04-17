import React from 'react';
import { useApp, SUBJECT_COLORS, PRIORITY_COLORS } from '../context/AppContext';
import './TaskItem.css';

function formatDate(s) {
  if (!s) return '';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TaskItem({ task, onDelete }) {
  const { toggleTask } = useApp();
  const sc = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.Math;
  const pc = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;

  return (
    <div className={`task-item ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)}>
      <div className="task-check">
        {task.done && <span className="check-mark">✓</span>}
      </div>
      <div className="task-title">{task.title}</div>
      <span
        className="task-subject"
        style={{ background: sc.bg, color: sc.color }}
      >
        {task.subject}
      </span>
      <span className="task-due">{formatDate(task.due)}</span>
      <div className="task-priority" style={{ background: pc }} />
      {onDelete && (
        <button
          className="task-delete"
          onClick={e => { e.stopPropagation(); onDelete(task.id); }}
          title="Delete"
        >✕</button>
      )}
    </div>
  );
}
