// Team section — fetches from API
import { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

function MemberCard({ member }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`glass rounded-2xl p-5 card-hover border border-white/5 flex flex-col items-center text-center gap-3 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Avatar */}
      <div className="relative">
        <img
          src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1a1b2e&color=818CF8&size=120`}
          alt={member.name}
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/8"
          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1a1b2e&color=818CF8&size=120`; }}
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600/90 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-sm font-bold text-white">{member.name}</h3>
        <p className="text-xs text-indigo-400 font-medium mt-0.5">{member.role}</p>
        <p className="text-xs text-slate-500 mt-0.5">{member.year}</p>
      </div>

      {/* Domain badge */}
      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/8 border border-cyan-500/15 text-cyan-400 font-medium">{member.domain}</span>

      {/* Quote */}
      {member.quote && (
        <p className="text-[11px] text-slate-400 italic leading-relaxed line-clamp-3">"{member.quote}"</p>
      )}

      {/* Social links */}
      <div className="flex gap-3 mt-auto pt-2 border-t border-white/5 w-full justify-center">
        {member.github && (
          <a href={member.github} target="_blank" rel="noopener noreferrer"
             className="text-slate-500 hover:text-white transition-colors p-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .322.21.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        )}
        {member.linkedin && (
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
             className="text-slate-500 hover:text-blue-400 transition-colors p-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

const FALLBACK_TEAM = [
  {
    id: "tm-1",
    name: "Lakshay Kalra",
    role: "President",
    domain: "Leadership & Vision",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/lakshay-kalra-5667ba387?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "The backbone and the mastermind of Code2Chill, a leader and visionary that strives to take technical innovation to new heights."
  },
  {
    id: "tm-2",
    name: "Jiya Arora",
    role: "Vice President",
    domain: "Operations & Community",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/jiya-arora-13b214377?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "The Universal support pillar and the one that makes sure code2chill runs smoothly with no bugs in the system 😉"
  },
  {
    id: "tm-3",
    name: "Samanyu Thakur",
    role: "Technical Head",
    domain: "Technology & Development",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/samanyu-thakur-76622b386?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "A Beast in the technical field with vast knowledge over the great spread of technical skills and a mentor that makes learning and refinement feel like a breeze."
  },
  {
    id: "tm-4",
    name: "Bhupinder Singh",
    role: "Technical Head",
    domain: "Technical Core & Systems",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/bhupindersinghmann?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "The epitome of discipline with technical knowledge that spans into the unknown, a proof that hard work and consistency never goes to waste."
  },
  {
    id: "tm-5",
    name: "Ayush Sharma",
    role: "Content Head",
    domain: "Content & Strategy",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/ayushthisside?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "Mastermind of all our ideas, the one that combines creativity with his extensive technical knowledge to make sure ‘Code’ and ‘Chill’ always go hand in hand."
  },
  {
    id: "tm-6",
    name: "Tamanna Kakkar",
    role: "Content Head",
    domain: "Creative & Content",
    year: "Chitkara University",
    image: "",
    github: "",
    linkedin: "https://www.linkedin.com/in/tamanna-kakkar-995b73385?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    quote: "A beautiful combination of wits and creativity that makes sure that code2chill always stays ahead of the game and that every event is a massive success."
  },
  {
    id: "tm-7",
    name: "Sagarjit Singh Batish",
    role: "Member",
    domain: "Development",
    year: "CSE",
    image: "",
    github: "https://github.com/sagarjitbatish-22",
    linkedin: "https://www.linkedin.com/in/sagarjit-singh-batish-697545431",
    quote: "Code, chill, repeat."
  }
];

export default function Team() {
  const { user } = useAuth();
  const [team,    setTeam]    = useState(FALLBACK_TEAM);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    domain: 'Technical Core',
    year: 'Chitkara University',
    linkedin: '',
    github: '',
    quote: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.getTeam()
      .then(d => {
        if (d.data && d.data.length > 0) {
          setTeam(d.data);
        } else {
          setTeam(FALLBACK_TEAM);
        }
      })
      .catch(() => setTeam(FALLBACK_TEAM))
      .finally(() => setLoading(false));
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      const data = await api.addMember(form);
      const newMember = data.data || { ...form, id: 'tm-' + Date.now() };
      setTeam(prev => [...prev, newMember]);
      setShowForm(false);
      setForm({ name: '', role: '', domain: 'Technical Core', year: 'Chitkara University', linkedin: '', github: '', quote: '' });
      setMsg('✅ Team member added successfully!');
    } catch (err) {
      setMsg('❌ ' + (err.message || 'Failed to add member'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="team" className="py-20 px-5 max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-indigo-400 mb-2 tracking-widest uppercase">Team</div>
          <h2 className="text-3xl font-bold text-white">The builders behind C2C</h2>
          <p className="text-sm text-slate-500 mt-2">Students, mentors, and leads making it happen at Chitkara University, Rajpura.</p>
        </div>
        {user && (
          <button onClick={() => setShowForm(s => !s)}
                  className="text-xs font-semibold px-4 py-2 rounded-xl border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all self-start sm:self-auto">
            {showForm ? 'Cancel' : '+ Add Team Member'}
          </button>
        )}
      </div>

      {/* Add Member Form */}
      {showForm && user && (
        <form onSubmit={handleAddMember} className="glass rounded-2xl p-6 mb-8 border border-indigo-500/20 animate-fade-in">
          <h3 className="text-sm font-bold text-white mb-4">Add New Team Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Full Name *" required value={form.name}
                   onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                   className="bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all" />
            <input type="text" placeholder="Role (e.g. Technical Head, Design Lead) *" required value={form.role}
                   onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                   className="bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all" />
            <select value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))}
                    className="bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all">
              {['Leadership & Vision','Operations & Community','Technology & Development','Technical Core & Systems','Content & Strategy','Creative & Content','AI & ML','Competitive Programming','Design & UI','Development'].map(d => <option key={d} value={d} className="bg-[#131625] text-white">{d}</option>)}
            </select>
            <input type="text" placeholder="Year / Department (e.g. 3rd Year, CSE / Chitkara University)" value={form.year}
                   onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                   className="bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all" />
            <input type="url" placeholder="LinkedIn Profile URL" value={form.linkedin}
                   onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))}
                   className="bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all" />
            <input type="url" placeholder="GitHub Profile URL (optional)" value={form.github}
                   onChange={e => setForm(p => ({ ...p, github: e.target.value }))}
                   className="bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all" />
          </div>
          <textarea placeholder="Quote or description about the member…" value={form.quote}
                    onChange={e => setForm(p => ({ ...p, quote: e.target.value }))}
                    rows={2}
                    className="mt-3 w-full bg-[#131625] border border-slate-700/70 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all resize-none" />
          {msg && <p className="text-xs mt-2 text-slate-400">{msg}</p>}
          <button type="submit" disabled={submitting}
                  className="mt-3 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold disabled:opacity-60 transition-all">
            {submitting ? 'Adding…' : 'Save Member'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-56 rounded-2xl shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {team.map(m => <MemberCard key={m._id || m.id} member={m} />)}
        </div>
      )}
    </section>
  );
}
