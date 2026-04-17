import axios from 'axios';

const API_BASE = 'https://smart-study-planner-backend-zdvs.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ── Tasks ──────────────────────────────────────────────
export const taskService = {
  getAll: ()              => api.get('/tasks').then(r => r.data),
  getBySubject: (subj)   => api.get(`/tasks?subject=${subj}`).then(r => r.data),
  getToday: ()            => api.get('/tasks/today').then(r => r.data),
  create: (task)          => api.post('/tasks', task).then(r => r.data),
  update: (id, task)      => api.put(`/tasks/${id}`, task).then(r => r.data),
  toggle: (id)            => api.patch(`/tasks/${id}/toggle`).then(r => r.data),
  delete: (id)            => api.delete(`/tasks/${id}`).then(r => r.data),
};

// ── Subjects ───────────────────────────────────────────
export const subjectService = {
  getAll: () => api.get('/subjects').then(r => r.data),
};

// ── Stats ──────────────────────────────────────────────
export const statsService = {
  getDashboard: () => api.get('/stats').then(r => r.data),
};

// ── Focus Sessions ─────────────────────────────────────
export const sessionService = {
  getAll: ()        => api.get('/sessions').then(r => r.data),
  create: (session) => api.post('/sessions', session).then(r => r.data),
};

export default api;
