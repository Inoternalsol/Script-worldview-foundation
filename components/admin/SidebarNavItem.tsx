'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export function SidebarNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname()
  // Match exact or sub-paths (e.g. /admin/blog matches /admin/blog/new)
  const isActive = pathname === item.href || 
    (item.href !== '/admin' && pathname.startsWith(item.href + '/')) ||
    (item.href !== '/admin' && pathname === item.href)

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-brand-primary text-white shadow-sm'
          : 'text-foreground/70 hover:bg-brand-primary/8 hover:text-brand-primary'
      )}
    >
      <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-foreground/50')} />
      {item.label}
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground/60" />
      )}
    </Link>
  )
}
