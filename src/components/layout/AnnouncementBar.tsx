import React from 'react'

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-neutral-900 text-neutral-100 text-[11px] sm:text-xs font-medium py-2 px-4 text-center tracking-wider uppercase border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
        <span>✨ Handcrafted Museum-Quality Frames</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">Free Express Shipping on Orders Above ₹999</span>
        <span className="hidden sm:inline">•</span>
        <span>Use Code <strong className="text-amber-300 font-bold tracking-widest">WELCOME10</strong> for 10% Off</span>
      </div>
    </div>
  )
}
