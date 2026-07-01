'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMWEzYTVjIi8+PC9zdmc+'

export function HeroSection({ title, subtitle, backgroundImage }: { title?: string; subtitle?: string; backgroundImage?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Parallax hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Framer motion transforms for parallax
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])
  const opacityText = useTransform(scrollYProgress, [0, 1], [1, 0.4])

  return (
    <section ref={containerRef} className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[#0c1a2c] pb-16 pt-24 md:pb-24">
      {/* Background video with parallax motion */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 h-[120%] w-full bg-[#0c1a2c]">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={backgroundImage || "/images/home-hero.png"}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-african-children-smiling-at-the-camera-41873-large.mp4" type="video/mp4" />
          {/* Fallback image if video fails is handled by poster attribute */}
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1a2c]/95 via-[#0c1a2c]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a2c]/90 via-[#0c1a2c]/40 to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 md:px-8">
        <motion.div style={{ y: yText, opacity: opacityText }} className="text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {title ? title : <>Shaping Minds. <br className="hidden sm:block" /> Transforming Communities.</>}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-base text-white/90 sm:text-lg md:text-xl"
          >
            {subtitle ? subtitle : "Script Worldview Foundation is a faith-inspired NGO advancing education, humanitarian response, and community development across Nigeria."}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Button asChild variant="cta" size="lg" className="h-14 px-8 text-base shadow-lg shadow-brand-secondary/20 hover:scale-102 transition-transform">
              <Link href="/donate">Donate Now</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-14 px-8 text-base bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:scale-102 transition-transform">
              <Link href="/about">Learn About Us</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating statistics cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto pt-6"
        >
          {[
            { value: '15,000+', label: 'Students Reached', desc: 'Scholarships & school materials' },
            { value: '120+', label: 'Communities Empowered', desc: 'Sustainable local development' },
            { value: '85%', label: 'Efficiency Rate', desc: 'Funds directly to programs' }
          ].map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-lg shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/25"
            >
              <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/5 blur-2xl transition-all group-hover:bg-white/10" />
              <div className="font-heading text-3xl font-black text-white md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-bold text-white/90">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-white/60">
                {stat.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
