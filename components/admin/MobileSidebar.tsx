'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { SidebarNavigation } from '@/components/admin/SidebarNavigation'
import { SignOutButton } from '@/components/admin/SignOutButton'

export function MobileSidebar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden mr-3 rounded-md p-1.5 text-foreground hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm flex flex-col bg-card shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white text-xs font-black shadow-md">
              SWF
            </div>
            <div>
              <div className="font-heading text-sm font-bold text-foreground leading-none">Admin Panel</div>
              <div className="text-[11px] text-brand-muted mt-0.5 leading-none">Script Worldview</div>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1.5 text-brand-muted hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-xs font-bold text-brand-primary uppercase">
              {user?.name?.charAt(0) ?? 'A'}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-foreground">{user?.name ?? 'Admin'}</div>
              <div className="truncate text-[10px] text-brand-muted capitalize">{user?.role?.replace('_', ' ') ?? 'Admin'}</div>
            </div>
          </div>
        </div>

        <SidebarNavigation />

        <div className="border-t border-border p-3">
          <SignOutButton />
        </div>
      </div>
    </>
  )
}
