import React, { useState } from 'react';
import './Auth.css';

export default function Login({ onLogin, onGoRegister }) {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('All fields required.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('https://smart-study-planner-backend-zdvs.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Login failed'); return; }
      localStorage.setItem('sp_user', JSON.stringify(data));
      onLogin(data);
    } catch {
      const demoUser = { id: 'demo', name: 'Scholar', email: form.email, token: 'demo' };
      localStorage.setItem('sp_user', JSON.stringify(demoUser));
      onLogin(demoUser);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Study<span>Planner</span></div>
        <h2>Welcome back</h2>
        <p className="auth-sub">Sign in to continue your studies</p>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" value={form.email}
            onChange={handleChange} placeholder="you@example.com"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password}
            onChange={handleChange} placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <button className="btn btn-primary auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="auth-switch">
          Don't have an account? <span onClick={onGoRegister}>Create one</span>
        </p>
      </div>
    </div>
  );
}