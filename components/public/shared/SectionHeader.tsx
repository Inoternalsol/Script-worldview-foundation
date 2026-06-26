'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils/cn'

export type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  light?: boolean
  centered?: boolean
}

export function SectionHeader({ eyebrow, title, description, light, centered }: SectionHeaderProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn('max-w-2xl', centered && 'mx-auto text-center')}
    >
      {eyebrow ? (
        <div className={cn(
          'mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest',
          light
            ? 'bg-white/15 text-white/80'
            : 'bg-brand-primary/10 text-brand-primary'
        )}>
          {eyebrow}
        </div>
      ) : null}
      <h2 className={cn(
        'font-heading text-2xl font-bold leading-tight md:text-3xl lg:text-4xl',
        light ? 'text-white' : 'text-foreground'
      )}>
        {title}
      </h2>
      {description ? (
        <p className={cn(
          'mt-4 text-base leading-relaxed',
          light ? 'text-white/75' : 'text-brand-muted'
        )}>
          {description}
        </p>
      ) : null}
    </motion.div>
  )
}
