import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Sidebar.css';

const PALETTE = [
  '#e8a630','#5b9bd5','#5fba7d','#b97de8',
  '#e05555','#e87d5b','#5be8c8','#e85b9b',
  '#a0e85b','#5b8be8','#e8d45b','#5be868',
];

export default function Sidebar({ activePage, onNavigate, onFilterSubject, subjects, setSubjects }) {
  const { pendingToday, pendingAll, tasks } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ label: '', color: '#e8a630' });
  const [error, setError] = useState('');

  const subjectCount = (key) => tasks.filter(t => t.subject === key && !t.done).length;

  const handleAdd = () => {
    if (!form.label.trim()) { setError('Subject name is required.'); return; }
    const key = form.label.trim().replace(/\s+/g, '_').toUpperCase();
    if (subjects.find(s => s.key === key)) { setError('Subject already exists.'); return; }
    setSubjects(prev => [...prev, { key, label: form.label.trim(), color: form.color }]);
    setForm({ label: '', color: '#e8a630' });
    setError('');
    setShowModal(false);
  };

  const handleDelete = (e, key) => {
    e.stopPropagation();
    setSubjects(prev => prev.filter(s => s.key !== key));
  };

  return (
    <>
      <nav className="sidebar">
        <div className="sidebar-label">Menu</div>
        <div className="sidebar-section">
          <NavItem icon="🏠" label="Dashboard" active={activePage === 'dashboard'}
            onClick={() => onNavigate('dashboard')} badge={pendingToday} badgeHot />
          <NavItem icon="📅" label="Weekly Planner" active={activePage === 'planner'}
            onClick={() => onNavigate('planner')} />
          <NavItem icon="⏱" label="Focus Timer" active={activePage === 'timer'}
            onClick={() => onNavigate('timer')} />
          <NavItem icon="✅" label="All Tasks" active={activePage === 'tasks'}
            onClick={() => onNavigate('tasks')} badge={pendingAll} />
        </div>

        <hr className="sidebar-divider" />

        <div className="sidebar-subjects-header">
          <div className="sidebar-label" style={{ padding: '8px 0 4px' }}>Subjects</div>
          <button className="add-subject-btn" onClick={() => setShowModal(true)} title="Add Subject">+</button>
        </div>

        <div className="sidebar-section">
          {subjects.map(s => (
            <div key={s.key} className="nav-item subject-nav-item" onClick={() => onFilterSubject(s.key)}>
              <span className="subject-dot" style={{ background: s.color }} />
              <span className="subject-nav-label">{s.label}</span>
              <span className="badge">{subjectCount(s.key)}</span>
              <button className="subject-delete-btn" onClick={(e) => handleDelete(e, s.key)} title="Remove">✕</button>
            </div>
          ))}
        </div>
      </nav>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2>Add New Subject</h2>
            {error && <div className="error-banner">{error}</div>}
            <div className="form-group">
              <label>Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Chemistry, History..."
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="form-group">
              <label>Pick a Color</label>
              <div className="color-palette">
                {PALETTE.map(c => (
                  <div key={c}
                    className={`color-swatch ${form.color === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                  />
                ))}
              </div>
              <div className="color-preview">
                <span className="subject-dot" style={{ background: form.color }} />
                <span style={{ color: form.color, fontSize: '0.85rem', fontWeight: 500 }}>
                  {form.label || 'Preview'}
                </span>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => { setShowModal(false); setError(''); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Add Subject</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({ icon, label, active, onClick, badge, badgeHot }) {
  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="nav-icon">{icon}</span>
      {label}
      {badge !== undefined && <span className={`badge ${badgeHot ? 'hot' : ''}`}>{badge}</span>}
    </div>
  );
}