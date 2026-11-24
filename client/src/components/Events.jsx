// Events section — fetches from API
import { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate, truncate } from '../utils';

const CATEGORIES = ['All', 'Hackathon', 'Workshop', 'CP Contest'];
const STATUS_COLOR = {
  Upcoming:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Completed: 'text-slate-400  bg-slate-700/30   border-slate-600/20',
  Ongoing:   'text-cyan-400   bg-cyan-500/10    border-cyan-500/20',
};

function EventCard({ event, onRsvp }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [rsvped, setRsvped]   = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const handleRsvp = async () => {
    if (rsvped || event.status === 'Completed') return;
    setRsvped(true);
    try { await onRsvp(event._id || event.id); } catch {}
  };

  return (
    <div ref={ref} className={`glass rounded-2xl p-5 card-hover border border-white/5 flex flex-col gap-4 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className={`inline-block text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full border mb-2 ${STATUS_COLOR[event.status] || STATUS_COLOR.Upcoming}`}>
            {event.status}
          </span>
          <h3 className="text-sm font-bold text-white leading-snug">{event.title}</h3>
          {event.tagline && <p className="text-xs text-indigo-400 mt-0.5 font-medium">{event.tagline}</p>}
        </div>
        <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap pt-0.5">
          {event.category}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed">{truncate(event.description, 130)}</p>

      {/* Meta */}
      <div className="flex flex-col gap-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>{formatDate(event.date)} · {event.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span className="truncate">{event.venue}</span>
        </div>
      </div>

      {/* Tags */}
      {event.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {event.tags.slice(0, 4).map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/8 text-indigo-300 border border-indigo-500/15">{t}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
        <span className="text-[11px] text-slate-500">
          {event.rsvpCount ? `${event.rsvpCount} RSVPs` : 'Be first to RSVP'}
        </span>
        <button
          onClick={handleRsvp}
          disabled={rsvped || event.status === 'Completed'}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all
            ${event.status === 'Completed'
              ? 'bg-slate-800 text-slate-600 cursor-default'
              : rsvped
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
          {event.status === 'Completed' ? 'Concluded' : rsvped ? '✓ RSVP\'d' : 'RSVP Now'}
        </button>
      </div>
    </div>
  );
}

export default function Events() {
  const { user } = useAuth();
  const isAdmin = user && (user.isAdmin === true || user.email?.toLowerCase() === 'sagarjit2174.beaiml26@gmail.com');
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ title:'', tagline:'', description:'', category:'Workshop', date:'', time:'05:00 PM IST', venue:'', tags:'' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.getEvents()
      .then(d => setEvents(d.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRsvp = async (id) => {
    const data = await api.rsvpEvent(id);
    setEvents(prev => prev.map(e =>
      (e._id === id || e.id === id) ? { ...e, rsvpCount: data.rsvpCount } : e
    ));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true); setMsg('');
    try {
      const data = await api.createEvent(form);
      setEvents(prev => [data.data, ...prev]);
      setShowForm(false);
      setForm({ title:'', tagline:'', description:'', category:'Workshop', date:'', time:'05:00 PM IST', venue:'', tags:'' });
      setMsg('✅ Event published!');
    } catch (err) {
      setMsg('❌ ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter);

  return (
    <section id="events" className="py-20 px-5 max-w-6xl mx-auto">
      {/* Section header */}
      <div className="mb-10">
        <div className="text-xs font-mono text-indigo-400 mb-2 tracking-widest uppercase">Events</div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="text-3xl font-bold text-white">What we're up to</h2>
          {isAdmin && (
            <button onClick={() => setShowForm(s => !s)}
                    className="text-xs font-semibold px-4 py-2 rounded-xl border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all self-start sm:self-auto">
              {showForm ? 'Cancel' : '+ Add Event'}
            </button>
          )}
        </div>
      </div>

      {/* Add event form */}
      {showForm && isAdmin && (
        <form onSubmit={handleCreate} className="glass rounded-2xl p-6 mb-8 border border-indigo-500/20 animate-fade-in">
          <h3 className="text-sm font-bold text-white mb-4">Publish New Event</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name:'title',       placeholder:'Event Title',                required:true },
              { name:'tagline',     placeholder:'Tagline (optional)',          required:false },
              { name:'venue',       placeholder:'Venue',                       required:true },
              { name:'time',        placeholder:'Time  e.g. 05:00 PM IST',    required:false },
              { name:'tags',        placeholder:'Tags (comma separated)',      required:false },
            ].map(f => (
              <input key={f.name}
                     type="text"
                     placeholder={f.placeholder}
                     required={f.required}
                     value={form[f.name]}
                     onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                     className="bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all" />
            ))}
            <input type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                   className="bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all" />
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all">
              {['Workshop','Hackathon','CP Contest','Talk','Meetup'].map(c => <option key={c} value={c} className="bg-[#131625] text-white">{c}</option>)}
            </select>
          </div>
          <textarea placeholder="Description…" required value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3}
                    className="mt-3 w-full bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all resize-none" />
          {msg && <p className="text-xs mt-2 text-slate-400">{msg}</p>}
          <button type="submit" disabled={submitting}
                  className="mt-3 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-60 transition-all">
            {submitting ? 'Publishing…' : 'Publish Event'}
          </button>
        </form>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                    filter === c
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-white/8 text-slate-400 hover:border-indigo-500/40 hover:text-white'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-56 rounded-2xl shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600 text-sm">No events found for "{filter}"</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(evt => (
            <EventCard key={evt._id || evt.id} event={evt} onRsvp={handleRsvp} />
          ))}
        </div>
      )}
    </section>
  );
}
