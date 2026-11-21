import React from 'react'
import { ShoppingBag, Frame } from 'lucide-react'

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Frame className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-lg text-white tracking-tight">yourframies</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <a href="#frames" className="hover:text-cyan-400 transition-colors">Custom Frames</a>
          <a href="#prints" className="hover:text-cyan-400 transition-colors">Art Prints</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
        </nav>
        <button
          type="button"
          aria-label="View Cart"
          className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
            0
          </span>
        </button>
      </div>
    </header>
  )
}
