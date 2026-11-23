// Navbar component
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home',   href: '#hero' },
  { label: 'Events', href: '#events' },
  { label: 'Team',   href: '#team' },
  { label: 'Instagram', href: '#instagram' },
];

export default function Navbar({ onAuthClick, onQueryClick }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 group-hover:text-cyan-400 transition-colors">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
          <span className="font-bold text-sm tracking-tight">
            <span className="text-gradient">Code</span>
            <span className="text-white">2Chill</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href}
               className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
              {l.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onQueryClick}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:border-indigo-500/50 hover:text-white transition-all">
            Ask Query
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-400 font-medium max-w-[120px] truncate">{user.name}</span>
              <button
                onClick={logout}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all">
              Team Login
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-1.5 text-slate-400" onClick={() => setMenuOpen(o => !o)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 px-5 py-4 flex flex-col gap-3 animate-fade-in">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
               className="text-sm text-slate-300 hover:text-white py-1">
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-white/5">
            <button onClick={() => { onQueryClick(); setMenuOpen(false); }}
                    className="flex-1 text-xs font-semibold py-2 rounded-lg border border-white/10 text-slate-300">
              Ask Query
            </button>
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                Logout
              </button>
            ) : (
              <button onClick={() => { onAuthClick(); setMenuOpen(false); }}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg bg-indigo-600 text-white">
                Team Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
