'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
  { value: 2000, suffix: '+', label: 'Lives Impacted' },
  { value: 12, suffix: '', label: 'Communities Served' },
  { value: 5, suffix: '', label: 'Active Programs' },
  { value: 500, prefix: '₦', suffix: 'k+', label: 'Raised' },
]

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = value / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      
      return () => clearInterval(timer)
    }
  }, [value, isInView])

  return <span ref={ref}>{count}</span>
}

export function ImpactCounter() {
  return (
    <section className="bg-brand-primary px-4 py-12 text-white md:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center md:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <div className="font-heading text-4xl font-bold md:text-5xl">
              {stat.prefix}
              <Counter value={stat.value} />
              {stat.suffix}
            </div>
            <div className="text-sm font-medium uppercase tracking-wider text-white/80">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
