// Hero section with animated particles + typing effect
import { useEffect, useRef, useState } from 'react';
import c2cLogo from '../assets/c2c-logo.jpg';

const TYPED_STRINGS = [
  'hack without limits.',
  'build cool things.',
  'chill and ship.',
  'connect at Chitkara.',
];

function useTypingEffect(strings, typingSpeed = 65, deletingSpeed = 35, pauseMs = 1800) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx]         = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused]   = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true); }, pauseMs);
      return () => clearTimeout(t);
    }
    const target = strings[idx];
    const speed  = deleting ? deletingSpeed : typingSpeed;

    const t = setTimeout(() => {
      if (!deleting) {
        const next = target.slice(0, display.length + 1);
        setDisplay(next);
        if (next === target) setPaused(true);
      } else {
        const next = display.slice(0, -1);
        setDisplay(next);
        if (next === '') {
          setDeleting(false);
          setIdx(i => (i + 1) % strings.length);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [display, deleting, paused, idx, strings, typingSpeed, deletingSpeed, pauseMs]);

  return display;
}

// Lightweight canvas-based particles
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const COUNT = Math.min(55, Math.floor((w * h) / 22000));
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.5 + 0.15,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.a})`;
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.07 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

export default function Hero({ onQueryClick }) {
  const typed = useTypingEffect(TYPED_STRINGS);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-grid">
      <ParticleCanvas />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-5 max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 mb-6 rounded-full border border-indigo-500/25 bg-indigo-500/8 text-indigo-300 text-xs font-medium animate-fade-in shadow-lg shadow-indigo-950/40">
          <img src={c2cLogo} alt="Code2Chill" className="w-4 h-4 rounded-full object-cover ring-1 ring-indigo-400/30" />
          Official Tech Club · Chitkara University, Rajpura
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight mb-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="text-gradient">Code</span>
          <span className="text-white">2</span>
          <span className="text-gradient">Chill</span>
        </h1>

        {/* Typing tagline */}
        <p className="text-lg sm:text-xl text-slate-400 mb-2 font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
          A place where you can&nbsp;
        </p>
        <p className="text-lg sm:text-xl font-mono font-semibold text-cyan-400 mb-8 h-7 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          {typed}
          <span className="inline-block w-0.5 h-5 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.35s' }}>
          <a href="#events"
             className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-900/40 hover:shadow-indigo-700/50">
            Explore Events
          </a>
          <button
            onClick={onQueryClick}
            className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white font-semibold text-sm transition-all">
            Ask a Query
          </button>
        </div>

        {/* Creative Interactive Showcase Deck */}
        <div className="mt-12 w-full max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {/* Mini Interactive Terminal Card */}
          <div className="glass rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl backdrop-blur-xl text-left font-mono relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-500">
            {/* Subtle background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
            
            {/* Terminal top bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-slate-400 text-[11px]">bash — code2chill.osl</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                online @ chitkara
              </span>
            </div>

            {/* Terminal commands */}
            <div className="space-y-1.5 text-xs">
              <p className="text-slate-400">
                <span className="text-pink-400 font-bold">$</span> c2c.manifesto()
              </p>
              <p className="text-cyan-300 pl-4 font-sans text-sm sm:text-base font-semibold">
                "Code with passion, build with ambition, chill without burnout."
              </p>
            </div>

            {/* Creative feature tags */}
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-2 text-[11px] font-sans">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
                ⚡ <span>24h Hackathons</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
                🧠 <span>AI & Deep Learning</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1.5">
                🏆 <span>CP & Algorithms</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                🌐 <span>Open Source</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1.5">
                ☕ <span>Chill Vibes</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </section>
  );
}
