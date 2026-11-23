// Footer component
export default function Footer({ onQueryClick }) {
  return (
    <footer className="border-t border-white/5 py-12 px-5 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
            <span className="font-bold text-sm">
              <span className="text-gradient">Code</span><span className="text-white">2Chill</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">Official Tech Club · Chitkara University, Rajpura</p>
          <p className="text-xs text-slate-700 mt-0.5">Est. 2021 · Rajpura, Punjab, India</p>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-xs text-slate-500">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-700 font-semibold">Navigate</span>
            {[['Events', '#events'], ['Team', '#team'], ['Instagram', '#instagram']].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-700 font-semibold">Connect</span>
            <a href="https://www.instagram.com/code2chill.osl?jplx=MWcxZzV0d3lhdmJnag==" target="_blank" rel="noopener noreferrer"
               className="hover:text-pink-400 transition-colors">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
               className="hover:text-blue-400 transition-colors">LinkedIn</a>
            <button onClick={onQueryClick} className="text-left hover:text-white transition-colors">Ask a Query</button>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-700">
        <span>© 2026 Code2Chill, Chitkara University Rajpura. All rights reserved.</span>
        <span className="font-mono text-slate-800">build(); chill();</span>
      </div>
    </footer>
  );
}
