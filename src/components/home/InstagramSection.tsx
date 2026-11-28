import React from 'react'
import { Heart } from 'lucide-react'

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

export const InstagramSection: React.FC = () => {
  const posts = [
    {
      img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      caption: 'Minimalist Botanical A4 print in Minimalist White frame.',
    },
    {
      img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
      caption: 'Porsche GT3 RS in Deep Black A4 frame.',
    },
    {
      img: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=600&q=80',
      caption: 'Personalised A4 photo keepsake.',
    },
    {
      img: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=600&q=80',
      caption: 'Gallery wall set in Deep Black & Minimalist White.',
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          #YourFramies
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-white mt-1">
          Framed Spaces
        </h2>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-2 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
        >
          <InstagramIcon className="w-4 h-4" />
          <span>@yourframies</span>
        </a>

        <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {posts.map((p, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden rounded-md bg-neutral-800"
            >
              <img
                src={p.img}
                alt={p.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                <p className="text-xs text-neutral-100 line-clamp-2">{p.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
