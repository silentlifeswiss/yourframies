import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useSiteContent } from '../../context/SiteContentContext'

interface HeroBannerProps {
  title?: string
  subtitle?: string
  imageUrl?: string
  ctaText?: string
  ctaLink?: string
  badgeText?: string
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  imageUrl,
  ctaText,
  ctaLink,
  badgeText,
}) => {
  const { homepageSections } = useSiteContent()
  const heroConfig = homepageSections.find((s) => s.type === 'hero')

  const finalTitle = title || heroConfig?.title || 'Artisanal Frames. Timeless Preservation.'
  const finalSubtitle =
    subtitle ||
    heroConfig?.subtitle ||
    'Bespoke solid wood framing for automotive photography, contemporary minimalist art, and your most treasured personal memories. Handcrafted with museum-grade precision in India.'
  const finalImage =
    imageUrl ||
    heroConfig?.imageUrl ||
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=2000&q=85'
  const finalCtaText = ctaText || heroConfig?.ctaText || 'Explore Collections'
  const finalCtaLink = ctaLink || heroConfig?.ctaLink || '/shop'
  const finalBadge = badgeText || heroConfig?.badgeText || "India's Premier Framing Atelier"

  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden min-h-[500px] sm:min-h-[640px] flex items-center">
      {/* Background Photography with subtle dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={finalImage}
          alt={finalTitle}
          className="w-full h-full object-cover object-center opacity-40 scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex flex-col items-start justify-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-neutral-200 text-[10px] sm:text-xs tracking-wider sm:tracking-widest uppercase font-medium mb-4 sm:mb-6">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
          <span>{finalBadge}</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="font-serif text-3xl sm:text-6xl lg:text-7xl font-light tracking-tight max-w-3xl leading-[1.15] sm:leading-[1.1] text-white">
          {finalTitle}
        </h1>

        <p className="mt-4 sm:mt-6 text-xs sm:text-base text-neutral-300 max-w-xl font-light leading-relaxed">
          {finalSubtitle}
        </p>

        {/* CTAs */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            to={finalCtaLink}
            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-neutral-900 text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors text-center shadow-xl flex items-center justify-center gap-2 rounded-xs active:scale-[0.98]"
          >
            <span>{finalCtaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/customize"
            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent border border-white/40 text-white text-xs uppercase tracking-widest font-semibold hover:bg-white/10 transition-colors text-center rounded-xs backdrop-blur-sm active:scale-[0.98]"
          >
            Open Custom Studio
          </Link>
        </div>
      </div>
    </section>
  )
}
