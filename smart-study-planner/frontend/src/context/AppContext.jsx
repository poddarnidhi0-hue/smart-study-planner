import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskService, statsService } from '../services/api';

const AppContext = createContext(null);

export const SUBJECT_COLORS = {
  Math:    { bg: 'rgba(232,166,48,0.12)',  color: '#e8a630', dot: '#e8a630' },
  Physics: { bg: 'rgba(91,155,213,0.12)',  color: '#5b9bd5', dot: '#5b9bd5' },
  CS:      { bg: 'rgba(95,186,125,0.12)',  color: '#5fba7d', dot: '#5fba7d' },
  English: { bg: 'rgba(185,125,232,0.12)', color: '#b97de8', dot: '#b97de8' },
};

export const PRIORITY_COLORS = {
  high: '#e05555', medium: '#e8a630', low: '#5fba7d',
};

function getKey(user) { return `studyplanner_tasks_${user?.id || 'guest'}`; }
function load(user)   { try { const s = localStorage.getItem(getKey(user)); return s ? JSON.parse(s) : null; } catch { return null; } }
function save(tasks, user) { try { localStorage.setItem(getKey(user), JSON.stringify(tasks)); } catch {} }

function fmt(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function AppProvider({ children, user }) {
  const [tasks, setTasksRaw]      = useState([]);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  const setTasks = useCallback((updater) => {
    setTasksRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save(next, user);
      return next;
    });
  }, [user]);

  const fetchTasks = useCallback(async () => {
    const stored = load(user);
    if (stored && stored.length > 0) {
      setTasksRaw(stored);
      try {
        const data = await taskService.getAll();
        setTasksRaw(data); save(data, user); setUsingDemo(false);
      } catch {}
      return;
    }
    try {
      const data = await taskService.getAll();
      setTasksRaw(data); save(data, user); setUsingDemo(false);
    } catch {
      const demo = getDemoTasks();
      setTasksRaw(demo); save(demo, user); setUsingDemo(true);
    }
  }, [user]);

  const fetchStats = useCallback(async () => {
    try { setStats(await statsService.getDashboard()); } catch { setStats(null); }
  }, []);

  useEffect(() => {
    Promise.all([fetchTasks(), fetchStats()]).finally(() => setLoading(false));
  }, [fetchTasks, fetchStats]);

  const addTask = async (taskData) => {
    const temp = { ...taskData, id: Date.now().toString(), done: false, createdAt: new Date().toISOString() };
    setTasks(prev => [...prev, temp]);
    try {
      const saved = await taskService.create({ ...taskData, userId: user?.id });
      setTasks(prev => prev.map(t => t.id === temp.id ? saved : t));
    } catch {}
  };

  const toggleTask = async (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    try { await taskService.toggle(id); } catch {}
  };

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try { await taskService.delete(id); } catch {}
  };

  const todayStr     = fmt(new Date());
  const todayTasks   = tasks.filter(t => t.due === todayStr);
  const pendingToday = todayTasks.filter(t => !t.done).length;
  const doneToday    = todayTasks.filter(t => t.done).length;
  const pendingAll   = tasks.filter(t => !t.done).length;

  return (
    <AppContext.Provider value={{
      tasks, todayTasks, pendingToday, doneToday, pendingAll,
      stats, loading, usingDemo, user,
      addTask, toggleTask, deleteTask, fetchTasks,
      SUBJECT_COLORS, PRIORITY_COLORS,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

function getDemoTasks() {
  const today = new Date();
  const tom   = new Date(today); tom.setDate(today.getDate() + 1);
  const nw    = new Date(today); nw.setDate(today.getDate() + 5);
  return [
    { id:'1', title:'Solve Integration Problems Set 3',  subject:'Math',    due:fmt(today), priority:'high',   done:false },
    { id:'2', title:'Read Chapter 7 Electromagnetism',   subject:'Physics', due:fmt(today), priority:'medium', done:true  },
    { id:'3', title:'Implement Binary Search Tree',      subject:'CS',      due:fmt(today), priority:'high',   done:false },
    { id:'4', title:'Write essay outline Macbeth',       subject:'English', due:fmt(today), priority:'low',    done:true  },
    { id:'5', title:'Review Thermodynamics notes',       subject:'Physics', due:fmt(tom),   priority:'medium', done:false },
    { id:'6', title:'Practice Graph Algorithms',         subject:'CS',      due:fmt(tom),   priority:'high',   done:false },
    { id:'7', title:'Math Assignment 3',                 subject:'Math',    due:fmt(nw),    priority:'high',   done:false },
    { id:'8', title:'Physics Lab Report',                subject:'Physics', due:fmt(nw),    priority:'medium', done:false },
    { id:'9', title:'English Essay Final Draft',         subject:'English', due:fmt(nw),    priority:'medium', done:false },
  ];
}