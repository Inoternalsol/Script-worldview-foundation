'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/public/shared/ThemeToggle'

type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Our Work',
    href: '/programs',
    children: [
      { label: 'Education & Training', href: '/programs/education' },
      { label: 'Humanitarian Response', href: '/programs/humanitarian' },
      { label: 'Community Development', href: '/programs/community' },
      { label: 'Research & Publications', href: '/programs/research' },
      { label: 'Capacity Building', href: '/programs/capacity' },
      { label: 'Sports & Athletics', href: '/programs/sports' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Track scroll position for the transparent → solid transition
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60)
  })

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const activeHref = useMemo(() => pathname ?? '/', [pathname])

  // Check if we're on the homepage where the hero is — used for transparent header
  const isHomePage = pathname === '/'
  const isTransparent = isHomePage && !scrolled

  return (
    <header
      className={cn(
        'z-50 w-full transition-all duration-300',
        isTransparent
          ? 'absolute top-0 left-0 right-0 bg-transparent border-transparent'
          : 'sticky top-0 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200/50 dark:border-white/5 shadow-sm backdrop-blur-md'
      )}
    >
      {/* Animated border bottom — appears on scroll */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 h-px transition-opacity duration-300',
          isTransparent ? 'bg-white/10 opacity-0' : 'bg-slate-200/50 dark:bg-white/10 opacity-100'
        )}
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center group-hover:opacity-80 transition-opacity">
            <div className="h-[36px] rounded-lg bg-card overflow-hidden flex items-start">
              <img
                src="/logo.png"
                alt="Script Worldview Foundation"
                className="h-[40px] w-auto max-w-none"
              />
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className={cn(
              "font-heading text-[15px] font-black uppercase tracking-wider leading-none transition-colors duration-300",
              isTransparent ? "text-white" : "text-brand-primary dark:text-white"
            )}>
              Script Worldview
            </span>
            <span className={cn(
              "font-heading text-[9px] font-bold uppercase tracking-[0.35em] mt-1 leading-none transition-colors duration-300",
              isTransparent ? "text-white/70" : "text-slate-500 dark:text-white/70"
            )}>
              Foundation
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            if (item.children?.length) {
              const isActive = activeHref.startsWith(item.href)
              return (
                <DropdownMenu.Root key={item.href}>
                  <DropdownMenu.Trigger
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 focus:outline-none group',
                      isTransparent
                        ? 'text-white/85 hover:bg-white/12 hover:text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary dark:hover:text-white',
                      isActive && (isTransparent ? 'bg-white/15 text-white' : 'bg-brand-primary/10 dark:bg-white/15 text-brand-primary dark:text-white')
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={12}
                      align="start"
                      className="min-w-56 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 rounded-2xl border border-border bg-card p-2 shadow-xl"
                    >
                      {item.children.map((child) => (
                        <DropdownMenu.Item key={child.href} asChild>
                          <Link
                            className={cn(
                              'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-foreground/80 outline-none transition-colors hover:bg-brand-primary/6 hover:text-brand-primary',
                              activeHref === child.href && 'bg-brand-primary/8 font-semibold text-brand-primary'
                            )}
                            href={child.href}
                          >
                            {activeHref === child.href && (
                              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                            )}
                            {child.label}
                          </Link>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              )
            }

            const isActive = activeHref === item.href
            return (
              <Link
                key={item.href}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                  isTransparent
                    ? 'text-white/85 hover:bg-white/12 hover:text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary dark:hover:text-white',
                  isActive && (isTransparent ? 'bg-white/15 text-white' : 'bg-brand-primary/10 dark:bg-white/15 text-brand-primary dark:text-white')
                )}
                href={item.href}
              >
                {item.label}
                {isActive && (
                  <span className={cn(
                    "absolute inset-x-3 -bottom-px h-px rounded-full",
                    isTransparent ? "bg-white/60" : "bg-brand-primary dark:bg-white/60"
                  )} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle isTransparent={isTransparent} />
          <Button
            asChild
            variant="cta"
            size="sm"
            className="hidden md:inline-flex h-9 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/donate">Donate Now</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur transition-all md:hidden",
              isTransparent
                ? "border-white/15 bg-white/10 text-white hover:bg-white/20"
                : "border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/20"
            )}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile menu — slide down */}
      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={cn(
          "overflow-hidden border-t backdrop-blur-md md:hidden",
          isTransparent
            ? "border-white/10 bg-slate-900/98 text-white"
            : "border-slate-200/50 dark:border-white/5 bg-white/98 dark:bg-slate-950/98"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 py-4 space-y-1">
          {nav.flatMap((item) => {
            if (item.children?.length) {
              return [
                <div key={item.href} className={cn(
                  "px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-widest",
                  isTransparent ? "text-white/40" : "text-slate-400 dark:text-white/40"
                )}>
                  {item.label}
                </div>,
                ...item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'block rounded-xl px-4 py-2.5 text-sm transition-colors',
                      isTransparent
                        ? 'text-white/80 hover:bg-white/10 hover:text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary dark:hover:text-white',
                      activeHref === child.href && (
                        isTransparent
                          ? 'bg-white/15 text-white font-medium'
                          : 'bg-brand-primary/10 dark:bg-white/15 text-brand-primary dark:text-white font-medium'
                      )
                    )}
                  >
                    {child.label}
                  </Link>
                )),
              ]
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                  isTransparent
                    ? 'text-white/85 hover:bg-white/10 hover:text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-primary dark:hover:text-white',
                  activeHref === item.href && (
                    isTransparent
                      ? 'bg-white/15 text-white'
                      : 'bg-brand-primary/10 dark:bg-white/15 text-brand-primary dark:text-white'
                  )
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="pt-3 pb-2">
            <Button asChild variant="cta" className="w-full font-semibold">
              <Link href="/donate">Donate Now</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
