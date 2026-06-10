'use client'

import { useState } from 'react'
import { PageHero } from '@/components/public/shared/PageHero'
import { Button } from '@/components/ui/button'
import { GalleryLightbox, GalleryItem } from '@/components/public/shared/GalleryLightbox'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// Seeded Gallery Items with accurate categories and descriptions
const galleryItems: GalleryItem[] = [
  {
    url: '/images/programs/education.png',
    title: 'Out-of-school Literacy Outreach Campaign',
    alt: 'Children reading books at a literacy outreach',
    category: 'Education',
  },
  {
    url: '/images/programs/humanitarian.png',
    title: 'Emergency Medical and Resource Distribution',
    alt: 'Volunteers distributing medical aid boxes',
    category: 'Humanitarian',
  },
  {
    url: '/images/blog/flood-relief.png',
    title: 'Flood Crisis Response and Nutrition Relief in Central Nigeria',
    alt: 'Aid distribution during flood relief program',
    category: 'Humanitarian',
  },
  {
    url: '/images/programs/community.png',
    title: "Women's Cooperative and Vocational Training Program",
    alt: 'Women gathered at a community cooperative meeting',
    category: 'Community',
  },
  {
    url: '/images/programs/sports.png',
    title: 'Hope Through Hoops: Youth Character Basketball Clinic',
    alt: 'Young boys and girls listening to a basketball coach',
    category: 'Events',
  },
  {
    url: '/images/home-hero.png',
    title: 'Youth Leadership and Civic Engagement Conference',
    alt: 'Crowd of young people celebrating at a leadership camp',
    category: 'Community',
  },
  {
    url: '/images/about-hero.png',
    title: 'Annual Impact and Community Transformation Summit 2025',
    alt: 'Large group photo of summit delegates and board members',
    category: 'Events',
  },
  {
    url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1000&auto=format&fit=crop&q=80',
    title: 'Classroom Support and Teacher Mentorship Initiative',
    alt: 'Teacher instructing a class of children',
    category: 'Education',
  },
  {
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80',
    title: 'Seeding Futures: Academic Scholarship Awards Ceremony',
    alt: 'Stack of books and certificates representing academic progress',
    category: 'Education',
  },
  {
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&auto=format&fit=crop&q=80',
    title: 'Clean Water Infrastructure Installation in Rural Communities',
    alt: 'Local community members drinking clean water from a newly drilled borehole',
    category: 'Humanitarian',
  },
  {
    url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140e2b8?w=1000&auto=format&fit=crop&q=80',
    title: 'Inter-Community Peacebuilding and Dialogue Council',
    alt: 'Diverse community elders and youth seated in discussion circles',
    category: 'Community',
  },
  {
    url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1000&auto=format&fit=crop&q=80',
    title: 'Annual Charity Run & Community Fundraiser',
    alt: 'Runners starting a marathon race for community development',
    category: 'Events',
  },
]

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Education' | 'Humanitarian' | 'Community' | 'Events'>('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Filter items based on active tab
  const filteredItems = galleryItems.filter((item) => {
    if (activeTab === 'All') return true
    return item.category === activeTab
  })

  const handleOpenLightbox = (index: number) => {
    // Find the item index in the filtered items array
    setSelectedIndex(index)
    setLightboxOpen(true)
  }

  const tabs: Array<'All' | 'Education' | 'Humanitarian' | 'Community' | 'Events'> = [
    'All',
    'Education',
    'Humanitarian',
    'Community',
    'Events',
  ]

  return (
    <div className="bg-background">
      <PageHero
        title="Media Gallery"
        subtitle="Explore photos and videos from our interventions, programs, and community events."
      />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          {/* Category Tabs */}
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'secondary'}
                onClick={() => setActiveTab(tab)}
                className={
                  activeTab === tab
                    ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
                    : 'bg-white text-brand-primary border border-black/5 hover:bg-gray-50'
                }
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Grid Layout */}
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={item.url}
                  onClick={() => handleOpenLightbox(index)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-cardHover"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={item.url}
                      alt={item.alt || 'Gallery image'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Dark Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-primary/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                      {item.category}
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-foreground leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center text-brand-muted">
              No media items found for this category.
            </div>
          )}
        </div>
      </section>

      {/* Full-screen Lightbox */}
      <GalleryLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={filteredItems}
        currentIndex={selectedIndex}
        setCurrentIndex={setSelectedIndex}
      />
    </div>
  )
}
