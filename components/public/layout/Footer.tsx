'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, MapPin, Phone, ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api/client'
import { toast } from '@/components/ui/use-toast'

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Programs', href: '/programs' },
  { label: 'Events', href: '/events' },
  { label: 'Donate', href: '/donate' },
  { label: 'Volunteer', href: '/volunteers' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const programs = [
  { label: 'Education & Training', href: '/programs/education' },
  { label: 'Humanitarian Response', href: '/programs/humanitarian' },
  { label: 'Community Development', href: '/programs/community' },
  { label: 'Research & Publications', href: '/programs/research' },
  { label: 'Capacity Building', href: '/programs/capacity' },
  { label: 'Sports & Athletics', href: '/programs/sports' },
]

const socials = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter / X' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    try {
      const res = await apiFetch<any>('/api/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        toast({ title: '🎉 Subscribed!', description: "You've joined the SWF newsletter." })
        setEmail('')
      } else {
        toast({ title: 'Error', description: res.error || 'Could not subscribe.', variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error', description: 'Please try again later.', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-[#0F2236] text-white">
      {/* Impact strip */}
      <div className="border-b border-white/8 bg-brand-primary/80">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-white/10 px-4 md:grid-cols-4 md:px-8">
          {[
            { value: '15,000+', label: 'Lives Impacted' },
            { value: '120+', label: 'Communities' },
            { value: '8 Years', label: 'Of Service' },
            { value: '₦500M+', label: 'Raised' },
          ].map((s) => (
            <div key={s.label} className="py-5 text-center">
              <div className="font-heading text-2xl font-black text-brand-accent">{s.value}</div>
              <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer body */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1 space-y-5">
            <div>
              <div className="font-heading text-xl font-black uppercase tracking-wider text-white leading-none">
                Script Worldview
              </div>
              <div className="font-heading text-xs font-bold uppercase tracking-[0.3em] text-white/40 mt-1.5 leading-none">
                Foundation
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/55">
              A faith-inspired NGO advancing education, humanitarian response, and sustainable community development across Nigeria since 2016.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 text-white/60 transition-all hover:bg-brand-accent hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Credibility badges */}
            <div className="space-y-1.5 text-xs text-white/35">
              <div className="font-mono">CAC Reg: RC 1234567</div>
              <div className="font-mono">EFCC Exempt: NGO-789</div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-white/40">Quick Links</div>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-white/40">Our Programs</div>
            <ul className="space-y-2.5">
              {programs.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Contact Us</div>
              <ul className="space-y-2.5 text-sm text-white/55">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                  <span>Jos, Plateau State, Nigeria</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-brand-accent" />
                  <a href="tel:+2340000000000" className="hover:text-white transition-colors">
                    +234 (0) 000 000 0000
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-brand-accent" />
                  <a href="mailto:contact@scriptworldview.org" className="hover:text-white transition-colors break-all">
                    contact@scriptworldview.org
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Newsletter</div>
              <p className="mb-3 text-xs text-white/40">
                Get updates on our programs and impact stories. No spam, ever.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  id="footer-newsletter-email"
                  name="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="flex-1 border-white/15 bg-white/8 text-white placeholder:text-white/30 focus-visible:border-brand-accent focus-visible:ring-brand-accent/20 text-sm"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="shrink-0 bg-brand-accent hover:bg-brand-accent/90 text-white"
                >
                  {isLoading ? '…' : <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-5 text-xs text-white/30 md:flex-row md:justify-between md:px-8">
          <div>
            © {new Date().getFullYear()} Script Worldview Foundation. All rights reserved. Registered NGO in Nigeria.
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Use', href: '/terms' },
              { label: 'Accessibility', href: '/accessibility' },
              { label: 'Site Map', href: '/programs' },
            ].map(({ label, href }) => (
              <Link key={href} className="hover:text-white transition-colors" href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
