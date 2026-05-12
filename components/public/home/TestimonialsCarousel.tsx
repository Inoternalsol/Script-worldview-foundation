'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    quote: "The scholarship provided by Script Worldview Foundation changed my life. I am now the first person in my family to attend university.",
    author: "Grace O.",
    location: "Enugu State",
  },
  {
    id: 2,
    quote: "When the floods took our home, the emergency relief team was there within 24 hours. Their support gave us hope when we had none.",
    author: "Ibrahim M.",
    location: "Kogi State",
  },
  {
    id: 3,
    quote: "The youth leadership seminar opened my eyes to my potential. I've since started a community clean-up initiative in my local area.",
    author: "Chidi N.",
    location: "Lagos",
  }
]

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-brand-primary/5 py-24">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
        <Quote className="mx-auto mb-8 h-12 w-12 text-brand-secondary/30" />
        
        <div className="relative h-[200px] md:h-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <p className="font-accent text-2xl font-medium italic leading-relaxed text-foreground md:text-3xl">
                "{testimonials[current].quote}"
              </p>
              <div className="mt-8">
                <div className="font-heading font-semibold text-brand-primary">
                  {testimonials[current].author}
                </div>
                <div className="text-sm text-brand-muted">
                  {testimonials[current].location}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? 'w-8 bg-brand-secondary' : 'w-2 bg-brand-secondary/30'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
