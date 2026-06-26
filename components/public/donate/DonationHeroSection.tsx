import { Heart, Shield, Users, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function DonationHeroSection() {
  return (
    <div className="relative overflow-hidden bg-brand-primary py-20 text-white">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-brand-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 text-center md:px-8">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
          <Heart className="h-3.5 w-3.5 text-brand-accent" /> Support Our Mission
        </div>
        <h1 className="mx-auto max-w-3xl font-heading text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
          Your Gift Transforms
          <span className="block text-brand-accent"> Communities</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
          Every Naira, Dollar, or Pound you give directly funds education, emergency relief, and lasting community development across Nigeria.
        </p>

        {/* Trust badges */}
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4">
          {[
            { icon: Shield, label: 'Secure & Encrypted', sub: 'SSL + PCI Compliant' },
            { icon: Star, label: '98% to Programs', sub: 'Only 2% overhead' },
            { icon: Users, label: '15,000+ Served', sub: 'Verified impact' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/8 p-3 text-center">
              <Icon className="mx-auto mb-1.5 h-5 w-5 text-brand-accent" />
              <div className="text-sm font-semibold text-white">{label}</div>
              <div className="text-xs text-white/50">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
