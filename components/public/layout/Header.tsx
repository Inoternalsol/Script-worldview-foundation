'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

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
      { label: 'Education', href: '/programs/education' },
      { label: 'Humanitarian', href: '/programs/humanitarian' },
      { label: 'Community', href: '/programs/community' },
      { label: 'Research', href: '/programs/research' },
      { label: 'Capacity', href: '/programs/capacity' },
    ],
  },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 64], [1, 1])
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const activeHref = useMemo(() => {
    if (!pathname) return '/'
    return pathname
  }, [pathname])

  return (
    <motion.header
      style={{ opacity: 1 }}
      className="sticky top-0 z-50"
    >
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-brand-primary/95 backdrop-blur-md shadow-md"
      />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white p-1">
            <Image 
              src="/logo.png" 
              alt="Script Worldview Foundation" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-heading text-[13px] sm:text-base font-bold uppercase tracking-wide text-white whitespace-nowrap leading-none">
              Script Worldview Foundation
            </div>
            <div className="hidden sm:block text-[9px] text-white/80 uppercase tracking-[0.11em] mt-1.5 whitespace-nowrap">
              Shaping Minds. Transforming Communities.
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => {
            if (item.children?.length) {
              const isActive = activeHref.startsWith(item.href)
              return (
                <DropdownMenu.Root key={item.href}>
                  <DropdownMenu.Trigger
                    className={cn(
                      'inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white focus:outline-none',
                      isActive && 'bg-white/10 text-white',
                    )}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={10}
                      className="min-w-52 rounded-xl border border-black/10 bg-white p-2 shadow-card"
                    >
                      {item.children.map((child) => (
                        <DropdownMenu.Item key={child.href} asChild>
                          <Link
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm text-foreground outline-none hover:bg-brand-primary/5',
                              activeHref === child.href && 'bg-brand-primary/5 font-medium',
                            )}
                            href={child.href}
                          >
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
                  'rounded-xl px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white',
                  isActive && 'bg-white/10 text-white',
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="cta" className="hidden md:inline-flex">
            <Link href="/donate">Donate Now</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="relative border-t border-white/10 bg-brand-primary md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-col gap-1">
              {nav.flatMap((item) => {
                if (item.children?.length) {
                  return [
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      {item.label}
                    </Link>,
                    ...item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded-xl px-3 py-2 pl-6 text-sm text-white/90 hover:bg-white/10"
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
                    className="rounded-xl px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                )
              })}
              <div className="pt-2">
                <Button asChild variant="cta" className="w-full">
                  <Link href="/donate">Donate Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </motion.header>
  )
}

