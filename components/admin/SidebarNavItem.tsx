'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Loader2, type LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export function SidebarNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)

  // Match exact or sub-paths (e.g. /admin/blog matches /admin/blog/new)
  const isActive = pathname === item.href || 
    (item.href !== '/admin' && pathname.startsWith(item.href + '/')) ||
    (item.href !== '/admin' && pathname === item.href)

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  return (
    <Link
      href={item.href}
      onClick={() => {
        if (!isActive) setIsNavigating(true)
      }}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden',
        isActive
          ? 'bg-gradient-to-r from-brand-primary/15 to-transparent text-brand-primary shadow-[inset_2px_0_0_0_var(--theme-primary)] dark:shadow-[inset_2px_0_0_0_#3b82f6]'
          : isNavigating
          ? 'bg-brand-primary/5 text-brand-primary font-bold'
          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
      )}
    >
      {/* Background hover effect */}
      {!isActive && (
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}

      {isNavigating ? (
        <Loader2 className="relative z-10 h-4 w-4 shrink-0 animate-spin text-brand-primary" />
      ) : (
        <item.icon
          className={cn(
            'relative z-10 h-4 w-4 shrink-0 transition-transform duration-300',
            isActive ? 'text-brand-primary' : 'text-foreground/50 group-hover:text-brand-primary group-hover:scale-110'
          )}
        />
      )}
      <span className="relative z-10 truncate">{item.label}</span>
      
      {/* Animated dot indicator for active state */}
      {isActive && !isNavigating && (
        <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-brand-primary shadow-[0_0_6px_rgba(59,130,246,0.5)] animate-pulse" />
      )}
    </Link>
  )
}
