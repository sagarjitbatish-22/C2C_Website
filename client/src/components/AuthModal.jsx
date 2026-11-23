// AuthModal — Team member Register / Login
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [form, setForm]       = useState({ name:'', email:'', password:'', role:'Team Member', domain:'Technical Core', department:'CSE', clubKey:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState({ text:'', type:'' });

  if (!open) return null;

  const reset = () => { setMsg({ text:'', type:'' }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg({ text:'', type:'' });

    try {
      if (mode === 'login') {
        const data = await login(form.email, form.password);
        setMsg({ text: data.message || 'Welcome back!', type: 'success' });
        setTimeout(() => { onClose(); reset(); }, 1200);
      } else {
        const data = await register(form);
        setMsg({ text: data.message || 'Registration successful! Please log in.', type: 'success' });
        setTimeout(() => { setMode('login'); setMsg({ text:'', type:'' }); }, 1800);
      }
    } catch (err) {
      setMsg({ text: err.message || 'Something went wrong', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm glass rounded-2xl sm:rounded-3xl border border-white/8 p-6 animate-slide-up"
           onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white">
              {mode === 'login' ? 'Team Login' : 'Register as Team Member'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'login' ? 'Sign in to your Code2Chill account' : 'Create your club member account'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 p-1 bg-white/4 rounded-xl mb-5">
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => { setMode(m); reset(); }}
                    className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-all ${
                      mode === m ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          {mode === 'register' && (
            <>
              <input type="text" placeholder="Full Name *" required value={form.name}
                     onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                     className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all" />
              <div className="grid grid-cols-2 gap-2">
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                        className="bg-[#0F111A] border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-indigo-500/60 transition-all">
                  {['Team Member','Core Team','Design Lead','Tech Lead','Event Lead'].map(r => <option key={r}>{r}</option>)}
                </select>
                <select value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
                        className="bg-[#0F111A] border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-indigo-500/60 transition-all">
                  {['Technical Core','AI/ML','Competitive Programming','Design & UI','Events & PR','Web Dev'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <input type="text" placeholder="Department (e.g. CSE)" value={form.department}
                     onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                     className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all" />
              <input type="text" placeholder="Club Passcode (ask your lead)" value={form.clubKey}
                     onChange={e => setForm(p => ({ ...p, clubKey: e.target.value }))}
                     className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all font-mono" />
              <p className="text-[10px] text-slate-600">Hint: ask your domain lead for the club passcode</p>
            </>
          )}

          <input type="email" placeholder="Email *" required value={form.email}
                 onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                 className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all" />
          <input type="password" placeholder="Password *" required value={form.password}
                 onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                 className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all" />

          {msg.text && (
            <p className={`text-xs px-3 py-2 rounded-lg ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {msg.text}
            </p>
          )}

          <button type="submit" disabled={loading}
                  className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-60 transition-all mt-1">
            {loading ? (mode === 'login' ? 'Signing in…' : 'Registering…') : (mode === 'login' ? 'Sign In →' : 'Create Account →')}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-4">
          {mode === 'login' ? "Not a member yet? " : "Already registered? "}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); reset(); }}
                  className="text-indigo-400 hover:text-indigo-300 font-medium">
            {mode === 'login' ? 'Register here' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
