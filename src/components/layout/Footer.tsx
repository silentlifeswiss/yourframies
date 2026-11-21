import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} yourframies. Crafted with care in India.</p>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="hover:text-slate-200">Privacy Policy</a>
          <a href="/terms" className="hover:text-slate-200">Terms of Service</a>
          <a href="/shipping" className="hover:text-slate-200">Shipping & Returns</a>
        </div>
      </div>
    </footer>
  )
}
