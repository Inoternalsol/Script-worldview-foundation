'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-brand-primary">
      {/* Background image fallback (could be replaced with video later) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home-hero.png"
          alt="Community coming together"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/90 via-brand-primary/75 to-brand-primary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 md:px-8 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading text-4xl font-bold leading-tight md:text-6xl lg:text-7xl"
        >
          Shaping Minds. <br className="hidden sm:block" /> Transforming Communities.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/90 md:text-xl"
        >
          Script Worldview Foundation is a faith-inspired NGO advancing education, humanitarian response, and community development across Nigeria.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Button asChild variant="cta" size="lg" className="h-14 px-8 text-base">
            <Link href="/donate">Donate Now</Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="h-14 px-8 text-base bg-white/10 hover:bg-white/20 text-white border-none">
            <Link href="/about">Learn About Us</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
