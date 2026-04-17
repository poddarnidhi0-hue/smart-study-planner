import React from 'react';
import { useApp } from '../context/AppContext';
import TaskItem from '../components/TaskItem';
import './Dashboard.css';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({ onAddTask, user }) {
  const { todayTasks, pendingToday, doneToday, deleteTask, loading } = useApp();
  const name = user?.name?.split(' ')[0] || 'Scholar';

  return (
    <div className="page-enter">
      <div className="greeting">
        <h1>{getGreeting()}, {name} ✦</h1>
        <p>You have <span>{pendingToday}</span> pending tasks today. Keep going!</p>
      </div>
      <div className="stats-row">
        <StatCard label="Tasks Done Today" value={doneToday} sub={`of ${todayTasks.length} scheduled`} />
        <StatCard label="Focus Minutes" value="125" sub="Goal: 180 min" />
        <StatCard label="Study Streak" value="7" sub="days in a row 🔥" />
      </div>
      <div className="progress-ring-wrap">
        <div className="ring-container">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="#2e2920" strokeWidth="8"/>
            <circle cx="45" cy="45" r="36" fill="none" stroke="#e8a630" strokeWidth="8"
              strokeDasharray="226" strokeDashoffset="68" strokeLinecap="round"
              transform="rotate(-90 45 45)"/>
          </svg>
          <div className="ring-label">
            <span className="ring-pct">70%</span>
            <span className="ring-sub-label">done</span>
          </div>
        </div>
        <div className="ring-info">
          <h3>Weekly Progress</h3>
          <p>You've completed 14 out of 20 planned study sessions this week. Keep the momentum going!</p>
        </div>
      </div>
      <div className="section-header">
        <div className="section-title">Today's Tasks</div>
        <button className="btn btn-ghost sm" onClick={onAddTask}>+ New</button>
      </div>
      {loading ? <div className="spinner" /> : todayTasks.length === 0 ? (
        <div className="empty-state"><div className="icon">🎉</div>No tasks for today!</div>
      ) : (
        <div className="task-list">
          {todayTasks.map(t => <TaskItem key={t.id} task={t} onDelete={deleteTask} />)}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}