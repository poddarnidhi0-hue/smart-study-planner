import React from 'react';
import './Header.css';

export default function Header({ onAddTask, user, onLogout }) {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'SP';

  return (
    <header className="header">
      <div className="logo">Study<span>Planner</span></div>
      <div className="header-right">
        <button className="btn btn-ghost" onClick={onAddTask}>+ Add Task</button>
        {user && (
          <div className="user-info">
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}