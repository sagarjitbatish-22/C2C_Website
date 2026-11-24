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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Name</label>
                <input type="text" placeholder="e.g. Sagarjit Singh" required value={form.name}
                       onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                       className="w-full bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Role</label>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                          className="w-full bg-[#131625] border border-slate-700/70 rounded-xl px-2.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all">
                    {['Team Member','Core Team','Design Lead','Tech Lead','Event Lead'].map(r => <option key={r} value={r} className="bg-[#131625] text-white">{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Domain</label>
                  <select value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
                          className="w-full bg-[#131625] border border-slate-700/70 rounded-xl px-2.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none transition-all">
                    {['Technical Core','AI/ML','Competitive Programming','Design & UI','Events & PR','Web Dev'].map(d => <option key={d} value={d} className="bg-[#131625] text-white">{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Department</label>
                <input type="text" placeholder="CSE" value={form.department}
                       onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                       className="w-full bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Club Passcode</label>
                <input type="password" placeholder="Enter club passcode" required autoComplete="off" value={form.clubKey}
                       onChange={e => setForm(p => ({ ...p, clubKey: e.target.value }))}
                       className="w-full bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono" />
                <p className="text-[10px] text-slate-500 mt-1">Ask your Code2Chill team lead for the passcode.</p>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Email Address</label>
            <input type="email" placeholder="yourname@chitkara.edu.in" required value={form.email}
                   onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                   className="w-full bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Password</label>
            <input type="password" placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'} required
                   minLength={mode === 'register' ? 8 : undefined} maxLength={128}
                   autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={form.password}
                   onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                   className="w-full bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
          </div>

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
