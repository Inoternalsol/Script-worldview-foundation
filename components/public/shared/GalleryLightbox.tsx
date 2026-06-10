'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'

export interface GalleryItem {
  url: string
  alt?: string
  title?: string
  category?: string
}

interface GalleryLightboxProps {
  isOpen: boolean
  onClose: () => void
  items: GalleryItem[]
  currentIndex: number
  setCurrentIndex: (index: number) => void
}

export function GalleryLightbox({
  isOpen,
  onClose,
  items,
  currentIndex,
  setCurrentIndex,
}: GalleryLightboxProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent background scrolling when lightbox is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, currentIndex, items])

  if (!isOpen || items.length === 0) return null

  const activeItem = items[currentIndex]

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % items.length)
  }

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + items.length) % items.length)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 p-4 text-white"
      >
        {/* Header Controls */}
        <div className="flex w-full items-center justify-between py-2 md:px-4">
          <div className="text-sm font-semibold text-white/70">
            {currentIndex + 1} / {items.length}
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-3 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close Lightbox"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content Box */}
        <div className="relative flex w-full flex-1 items-center justify-center">
          {/* Navigation - Left Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 z-55 rounded-full bg-white/10 p-3 text-white/80 transition-colors hover:bg-white/20 hover:text-white md:left-4"
            aria-label="Previous Image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Active Image Container */}
          <div className="relative h-full max-h-[75vh] w-full max-w-[85vw]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative h-full w-full"
              >
                <Image
                  src={activeItem.url}
                  alt={activeItem.alt || 'Gallery image'}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1280px) 100vw, 85vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation - Right Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 z-55 rounded-full bg-white/10 p-3 text-white/80 transition-colors hover:bg-white/20 hover:text-white md:right-4"
            aria-label="Next Image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Footer Details */}
        <div className="w-full text-center py-4 md:px-4">
          {activeItem.title && (
            <motion.h3
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-lg font-bold md:text-xl"
            >
              {activeItem.title}
            </motion.h3>
          )}
          {activeItem.category && (
            <motion.span
              key={`category-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 inline-block text-xs font-semibold uppercase tracking-wider text-brand-secondary"
            >
              {activeItem.category}
            </motion.span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
