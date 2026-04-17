import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TaskItem from '../components/TaskItem';
import './AllTasks.css';

export default function AllTasks({ onAddTask, subjectFilter, subjects = [] }) {
  const { tasks, deleteTask, loading } = useApp();
  const [activeFilter, setActiveFilter] = useState(subjectFilter || 'All');
  const [showDone, setShowDone] = useState(true);

  const filtered = tasks
    .filter(t => activeFilter === 'All' || t.subject === activeFilter)
    .filter(t => showDone || !t.done);

  return (
    <div className="page-enter">
      <div className="greeting">
        <h1>All Tasks</h1>
        <p>Manage and track every task across all your subjects.</p>
      </div>

      <div className="tasks-toolbar">
        <div className="filter-pills">
          <button
            className={`filter-pill ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>
          {subjects.map(s => (
            <button
              key={s.key}
              className={`filter-pill ${activeFilter === s.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(s.key)}
              style={activeFilter === s.key ? {
                background: `${s.color}18`,
                color: s.color,
                borderColor: `${s.color}50`
              } : {}}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showDone}
              onChange={e => setShowDone(e.target.checked)}
            />
            Show completed
          </label>
          <button className="btn btn-ghost sm" onClick={onAddTask}>+ Add Task</button>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          No tasks found.
        </div>
      ) : (
        <div className="task-list">
          {filtered.map(t => (
            <TaskItem key={t.id} task={t} onDelete={deleteTask} />
          ))}
        </div>
      )}
    </div>
  );
}