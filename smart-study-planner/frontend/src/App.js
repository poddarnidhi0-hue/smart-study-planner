import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header      from './components/Header';
import Sidebar     from './components/Sidebar';
import RightPanel  from './components/RightPanel';
import AddTaskModal from './components/Modal';
import Dashboard   from './pages/Dashboard';
import AllTasks    from './pages/AllTasks';
import Planner     from './pages/Planner';
import Timer       from './pages/Timer';
import Login       from './pages/Login';
import Register    from './pages/Register';
import './App.css';

export const DEFAULT_SUBJECTS = [
  { key: 'Math',    label: 'Mathematics',     color: '#e8a630' },
  { key: 'Physics', label: 'Physics',          color: '#5b9bd5' },
  { key: 'CS',      label: 'Computer Science', color: '#5fba7d' },
  { key: 'English', label: 'English',          color: '#b97de8' },
];

function AppLayout({ user, onLogout }) {
  const [page, setPage]                   = useState('dashboard');
  const [modalOpen, setModalOpen]         = useState(false);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [subjects, setSubjects]           = useState(DEFAULT_SUBJECTS);

  const openModal = () => setModalOpen(true);

  const handleFilterSubject = (subj) => {
    setSubjectFilter(subj);
    setPage('tasks');
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onAddTask={openModal} user={user} />;
      case 'planner':   return <Planner />;
      case 'timer':     return <Timer />;
      case 'tasks':     return (
        <AllTasks onAddTask={openModal} subjectFilter={subjectFilter} subjects={subjects} />
      );
      default: return <Dashboard onAddTask={openModal} user={user} />;
    }
  };

  return (
    <>
      <Header onAddTask={openModal} user={user} onLogout={onLogout} />
      <div className="app">
        <Sidebar
          activePage={page}
          onNavigate={setPage}
          onFilterSubject={handleFilterSubject}
          subjects={subjects}
          setSubjects={setSubjects}
        />
        <main className="main-content">{renderPage()}</main>
        <RightPanel subjects={subjects} />
      </div>
      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        subjects={subjects}
        user={user}
      />
    </>
  );
}

export default function App() {
  const [user, setUser]         = useState(null);
  const [authPage, setAuthPage] = useState('login');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sp_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setChecking(false);
  }, []);

  const handleLogin  = (data) => setUser(data);
  const handleLogout = () => {
    localStorage.removeItem('sp_user');
    setUser(null);
    setAuthPage('login');
  };

  if (checking) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0e0c09' }}>
      <div className="spinner" />
    </div>
  );

  if (!user) return authPage === 'login'
    ? <Login onLogin={handleLogin} onGoRegister={() => setAuthPage('register')} />
    : <Register onLogin={handleLogin} onGoLogin={() => setAuthPage('login')} />;

  return (
    <AppProvider user={user}>
      <AppLayout user={user} onLogout={handleLogout} />
    </AppProvider>
  );
}