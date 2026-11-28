import React from 'react'
import { Link } from 'react-router-dom'
import { HeroBanner } from '../components/home/HeroBanner'
import { CategoryGrid } from '../components/home/CategoryGrid'
import { ProductCarousel } from '../components/home/ProductCarousel'
import { WhyChooseUs } from '../components/home/WhyChooseUs'
import { FrameCustomizer } from '../components/product/FrameCustomizer'
import { InstagramSection } from '../components/home/InstagramSection'
import { Newsletter } from '../components/home/Newsletter'
import { useSiteContent, HomepageSection } from '../context/SiteContentContext'
import { ArrowRight } from 'lucide-react'

export const HomePage: React.FC = () => {
  const { homepageSections } = useSiteContent()

  // Sort active sections according to order set in Admin Homepage Editor
  const activeSections = [...homepageSections]
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order)

  const renderSection = (section: HomepageSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <HeroBanner
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            imageUrl={section.imageUrl}
            ctaText={section.ctaText}
            ctaLink={section.ctaLink}
            badgeText={section.badgeText}
          />
        )

      case 'categories':
        return <CategoryGrid key={section.id} />

      case 'bestsellers':
        return <ProductCarousel key={section.id} />

      case 'customizer_banner':
        return (
          <section
            key={section.id}
            className={`py-20 border-b ${
              section.backgroundStyle === 'neutral-900'
                ? 'bg-neutral-900 text-white border-neutral-800'
                : section.backgroundStyle === 'neutral-50'
                ? 'bg-neutral-50 border-neutral-200'
                : 'bg-white border-neutral-200'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  Live Frame Preview
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 mt-1">
                  {section.title || 'Frame Your Own Photo Live'}
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  {section.subtitle ||
                    'Upload your photo and preview how it looks in our A4 Deep Black or Minimalist White frame before ordering.'}
                </p>
              </div>

              <FrameCustomizer />
            </div>
          </section>
        )

      case 'why_choose_us':
        return <WhyChooseUs key={section.id} />

      case 'instagram':
        return <InstagramSection key={section.id} />

      case 'newsletter':
        return <Newsletter key={section.id} />

      case 'custom_banner':
        return (
          <section
            key={section.id}
            className={`py-20 px-4 sm:px-6 lg:px-8 border-b ${
              section.backgroundStyle === 'neutral-900'
                ? 'bg-neutral-900 text-white border-neutral-800'
                : section.backgroundStyle === 'neutral-50'
                ? 'bg-neutral-50 border-neutral-200'
                : 'bg-white border-neutral-200'
            }`}
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl space-y-4">
                {section.badgeText && (
                  <span className="text-xs font-semibold tracking-widest uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                    {section.badgeText}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-sm text-neutral-600 leading-relaxed font-light">
                    {section.subtitle}
                  </p>
                )}
                {section.ctaLink && section.ctaText && (
                  <div className="pt-2">
                    <Link
                      to={section.ctaLink}
                      className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 rounded transition"
                    >
                      <span>{section.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {section.imageUrl && (
                <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden shadow-xl border border-neutral-200">
                  <img
                    src={section.imageUrl}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white">
      {activeSections.map((sec) => renderSection(sec))}
    </div>
  )
}
