// Instagram section — official club profile showcase
const INSTAGRAM_URL = "https://www.instagram.com/code2chill.osl?jplx=MWcxZzV0d3lhdmJnag==";

export default function Instagram() {
  return (
    <section id="instagram" className="py-20 px-5 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="text-xs font-mono text-indigo-400 mb-2 tracking-widest uppercase">Social Connect</div>
        <h2 className="text-3xl font-bold text-white">Join Us on Instagram</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Get real-time event updates, hackathon announcements, tech reels, and behind-the-scenes moments from our campus chapter.
        </p>
      </div>

      {/* Main Instagram Profile Showcase Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden group shadow-2xl">
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/15 transition-all duration-700" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Profile Details */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Story-ring avatar */}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="relative group/avatar shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-xl shadow-pink-500/20 group-hover/avatar:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-[#0d0f1b] border-2 border-[#090b14] flex items-center justify-center p-3">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="url(#ig-avatar-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id="ig-avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
              </div>
            </a>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">@code2chill.osl</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  <span>Verified Club</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-medium">Code2Chill OSL · Chitkara University, Rajpura</p>
              <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
                Official Coding & Tech Club ⚡ Hackathons, DSA Sprints, Generative AI & Developer Culture.
              </p>
            </div>
          </div>

          {/* Follow CTA Button */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-semibold text-sm tracking-wide transition-all shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 group/btn"
            >
              <span>Follow on Instagram</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:translate-x-0.5 transition-transform">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>

            <div className="text-center">
              <span className="text-[11px] text-slate-500">Active Campus Community</span>
            </div>
          </div>
        </div>

        {/* Story / Highlights Strip */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-4 text-center sm:text-left">
            Featured Highlights
          </div>
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-start">
            {[
              { label: 'Hackathons', icon: '⚡' },
              { label: 'AI/ML Lab',  icon: '🤖' },
              { label: 'CP Sprints', icon: '🏆' },
              { label: 'Workshops',  icon: '🎙️' },
              { label: 'Campus Life',icon: '📸' },
              { label: 'Chill Sessions', icon: '☕' }
            ].map((story) => (
              <a
                key={story.label}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 shrink-0 group/story cursor-pointer"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 group-hover/story:scale-105 transition-transform duration-200">
                  <div className="w-full h-full rounded-full bg-[#111322] border-2 border-[#090b14] flex items-center justify-center text-lg sm:text-xl">
                    {story.icon}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 group-hover/story:text-pink-300 font-medium transition-colors">
                  {story.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
