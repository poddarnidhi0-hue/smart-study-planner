import React, { useState } from 'react';
import './Auth.css';

export default function Register({ onLogin, onGoLogin }) {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) { setError('All fields required.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
     const res = await fetch('https://smart-study-planner-backend-zdvs.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed'); return; }
      localStorage.setItem('sp_user', JSON.stringify(data));
      onLogin(data);
    } catch {
      const demoUser = { id: 'demo', name: form.name, email: form.email, token: 'demo' };
      localStorage.setItem('sp_user', JSON.stringify(demoUser));
      onLogin(demoUser);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Study<span>Planner</span></div>
        <h2>Create account</h2>
        <p className="auth-sub">Start your study journey today</p>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input name="confirm" type="password" value={form.confirm}
            onChange={handleChange} placeholder="Repeat password"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <button className="btn btn-primary auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <p className="auth-switch">
          Already have an account? <span onClick={onGoLogin}>Sign in</span>
        </p>
      </div>
    </div>
  );
}