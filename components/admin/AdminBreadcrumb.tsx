'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

const labelMap: Record<string, string> = {
  admin: 'Dashboard',
  volunteers: 'Volunteers',
  donations: 'Donations',
  campaigns: 'Campaigns',
  contacts: 'Messages',
  newsletter: 'Newsletter',
  content: 'Content',
  pages: 'Static Pages',
  programs: 'Programs',
  blog: 'Blog Posts',
  events: 'Events',
  careers: 'Careers',
  media: 'Media Library',
  users: 'Staff Accounts',
  chatbot: 'AI Chatbot',
  email: 'Email Dispatcher',
  'audit-log': 'Audit Logs',
  settings: 'Settings',
  new: 'New',
}

export function AdminBreadcrumb() {
  const pathname = usePathname()

  if (pathname === '/admin') return null

  const segments = pathname.split('/').filter(Boolean)
  
  return (
    <nav className="mb-5 flex items-center space-x-1.5 text-xs font-medium text-brand-muted">
      <Link
        href="/admin"
        className="flex items-center gap-1 hover:text-brand-primary transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Dashboard</span>
      </Link>

      {segments.map((segment, index) => {
        // Skip 'admin' since we rendered Dashboard explicitly
        if (segment === 'admin') return null

        const href = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        
        let label = labelMap[segment] || segment
        // If it looks like a database ID (e.g. alphanumeric nanoid/uuid)
        if (segment.length > 10 || /[0-9]/.test(segment)) {
          label = 'Details / Edit'
        } else {
          label = label.replace(/-/g, ' ')
        }

        return (
          <div key={href} className="flex items-center space-x-1.5">
            <ChevronRight className="h-3 w-3 text-brand-muted/40 shrink-0" />
            {isLast ? (
              <span className="text-foreground font-semibold truncate max-w-[180px]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-brand-primary transition-colors capitalize"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
