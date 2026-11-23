// QueryModal — public "Ask Query" bottom-sheet/modal
import { useState } from 'react';
import { api } from '../api';

const CATEGORIES = ['General', 'Club Recruitment', 'Event Info', 'Technical Help', 'Collaboration', 'Other'];

export default function QueryModal({ open, onClose }) {
  const [form, setForm]       = useState({ name:'', email:'', rollNumber:'', category:'General', subject:'', message:'' });
  const [submitting, setSub]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSub(true); setError(''); setSuccess('');
    try {
      const data = await api.submitQuery(form);
      setSuccess(data.message || 'Query submitted! We\'ll get back to you soon.');
      setForm({ name:'', email:'', rollNumber:'', category:'General', subject:'', message:'' });
    } catch (err) {
      setError(err.message || 'Failed to submit query. Please try again.');
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg glass rounded-2xl sm:rounded-3xl border border-white/8 p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white">Ask Code2Chill</h2>
            <p className="text-xs text-slate-500 mt-0.5">We'll reply within 24 hours</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center py-8 animate-fade-in">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-white mb-1">Query Received!</p>
            <p className="text-xs text-slate-400">{success}</p>
            <button onClick={onClose} className="mt-5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="Your Name *" required value={form.name}
                     onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                     className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all" />
              <input type="email" placeholder="Email *" required value={form.email}
                     onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                     className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all" />
              <input type="text" placeholder="Roll No. (optional)" value={form.rollNumber}
                     onChange={e => setForm(p => ({ ...p, rollNumber: e.target.value }))}
                     className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all" />
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      className="bg-[#0F111A] border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-indigo-500/60 transition-all">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <input type="text" placeholder="Subject *" required value={form.subject}
                   onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                   className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all" />
            <textarea placeholder="Your message / question… *" required rows={3} value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="bg-white/4 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 transition-all resize-none" />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button type="submit" disabled={submitting}
                    className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-60 transition-all mt-1">
              {submitting ? 'Submitting…' : 'Send Query →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
