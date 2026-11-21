import React from 'react'
import { useSiteContent } from '../../context/SiteContentContext'

export const AnnouncementBar: React.FC = () => {
  const { settings } = useSiteContent()

  if (!settings.announcementActive || !settings.announcementText) {
    return null
  }

  return (
    <div className="bg-neutral-900 text-neutral-100 text-[11px] sm:text-xs font-medium py-2 px-4 text-center tracking-wider uppercase border-b border-neutral-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap">
        <span>{settings.announcementText}</span>
      </div>
    </div>
  )
}
