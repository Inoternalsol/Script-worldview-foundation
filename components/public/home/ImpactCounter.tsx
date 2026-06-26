'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'

const stats = [
  { value: 15000, suffix: '+', label: 'Lives Impacted', description: 'Individuals reached across all programs' },
  { value: 120, suffix: '+', label: 'Communities', description: 'Villages and urban areas empowered' },
  { value: 50, suffix: '+', label: 'Relief Missions', description: 'Emergency humanitarian deployments' },
  { value: 5000, suffix: '+', label: 'Leaders Trained', description: 'Capacity building graduates' },
  { value: 8, suffix: '', label: 'Years of Impact', description: 'Serving Nigeria since 2016' },
  { value: 98, suffix: '%', label: 'Donor Trust', description: 'Of funds go directly to programs' },
]

export function ImpactCounter() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative overflow-hidden bg-brand-primary dark:bg-slate-950 py-20">
      {/* Subtle mesh gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 mb-4">
            Our Impact
          </div>
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            Numbers That Tell Our Story
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-px rounded-2xl overflow-hidden bg-white/10 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex flex-col items-center justify-center bg-brand-primary dark:bg-slate-900/50 p-6 text-center hover:bg-white/8 transition-colors duration-300"
            >
              <div className="font-heading text-4xl font-black text-white md:text-5xl tabular-nums">
                {isInView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    delay={i * 0.1}
                    separator=","
                    useEasing
                    enableScrollSpy={false}
                  />
                ) : (
                  '0'
                )}
                <span className="text-brand-accent">{stat.suffix}</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-white">{stat.label}</div>
              <div className="mt-1 text-xs text-white/50 leading-snug">{stat.description}</div>
              {/* Hover accent line */}
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
