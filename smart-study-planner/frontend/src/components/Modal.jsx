import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './Modal.css';

const PRIORITIES = [
  { value: 'high',   label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low',    label: '🟢 Low' },
];

export default function AddTaskModal({ open, onClose, subjects = [] }) {
  const { addTask } = useApp();
  const [form, setForm] = useState({
    title: '', subject: '', due: '', priority: 'medium',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm({
        title: '',
        subject: subjects[0]?.key || '',
        due: new Date().toISOString().split('T')[0],
        priority: 'medium'
      });
      setError('');
    }
  }, [open, subjects]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Task title is required.'); return; }
    await addTask(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Add New Task</h2>
        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label>Task Title</label>
          <input
            name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. Complete Chapter 5 exercises"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>Subject</label>
          <select name="subject" value={form.subject} onChange={handleChange}>
            {subjects.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input type="date" name="due" value={form.due} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Task</button>
        </div>
      </div>
    </div>
  );
}