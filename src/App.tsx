import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-cyan-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Tailwind CSS v4 &bull; Vite &bull; React &bull; TypeScript
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            yourframies
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
            Tailwind CSS is configured and ready to go. Build responsive, modern interfaces at light speed.
          </p>
        </div>

        {/* Interactive Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-4">
          <p className="text-sm text-slate-400">
            Interactive state & HMR test:
          </p>
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all duration-150"
          >
            Clicked {count} {count === 1 ? 'time' : 'times'}
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="text-cyan-400 font-semibold text-sm mb-1">Tailwind v4</div>
            <p className="text-xs text-slate-400">Zero-config Vite plugin with modern CSS first engine.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="text-sky-400 font-semibold text-sm mb-1">React 19 + TS</div>
            <p className="text-xs text-slate-400">Strictly typed components with blazing fast Vite HMR.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="text-blue-400 font-semibold text-sm mb-1">Responsive</div>
            <p className="text-xs text-slate-400">Mobile-first utility classes ready for wireframes & UI.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
