// App.jsx — root component
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar      from './components/Navbar';
import Hero        from './components/Hero';
import Events      from './components/Events';
import Team        from './components/Team';
import Instagram   from './components/Instagram';
import Footer      from './components/Footer';
import QueryModal  from './components/QueryModal';
import AuthModal   from './components/AuthModal';
import AdminQueriesModal from './components/AdminQueriesModal';

export default function App() {
  const [queryOpen, setQueryOpen] = useState(false);
  const [authOpen,  setAuthOpen]  = useState(false);
  const [adminQueriesOpen, setAdminQueriesOpen] = useState(false);

  return (
    <AuthProvider>
      {/* Fixed query button bottom-right */}
      <button
        onClick={() => setQueryOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 hover:shadow-indigo-700/60 flex items-center justify-center transition-all group"
        title="Ask a Query">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      <Navbar
        onAuthClick={() => setAuthOpen(true)}
        onQueryClick={() => setQueryOpen(true)}
        onAdminQueriesClick={() => setAdminQueriesOpen(true)}
      />

      <main>
        <Hero    onQueryClick={() => setQueryOpen(true)} />
        <Events  />
        <Team    />
        <Instagram />
      </main>

      <Footer onQueryClick={() => setQueryOpen(true)} />

      <QueryModal open={queryOpen} onClose={() => setQueryOpen(false)} />
      <AuthModal  open={authOpen}  onClose={() => setAuthOpen(false)}  />
      <AdminQueriesModal open={adminQueriesOpen} onClose={() => setAdminQueriesOpen(false)} />
    </AuthProvider>
  );
}
