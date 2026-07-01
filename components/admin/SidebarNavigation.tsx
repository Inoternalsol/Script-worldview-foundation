'use client'

import { SidebarNavItem } from '@/components/admin/SidebarNavItem'
import {
  LayoutDashboard,
  Users,
  Heart,
  Mail,
  FileText,
  Calendar,
  Briefcase,
  Settings,
  MessageSquare,
  Image,
  Shield,
  Terminal,
  TrendingUp,
  Target,
  BarChart3,
  Home,
  UserCheck,
  ShieldCheck,
} from 'lucide-react'

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { href: '/admin/volunteers', label: 'Volunteers', icon: Users },
      { href: '/admin/donations', label: 'Donations', icon: Heart },
      { href: '/admin/campaigns', label: 'Fundraisers', icon: Target },
      { href: '/admin/contacts', label: 'Messages', icon: MessageSquare },
      { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/content/home', label: 'Home Page', icon: Home },
      { href: '/admin/content/pages', label: 'Static Pages', icon: FileText },
      { href: '/admin/programs', label: 'Programs', icon: TrendingUp },
      { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
      { href: '/admin/events', label: 'Events', icon: Calendar },
      { href: '/admin/careers', label: 'Careers', icon: Briefcase },
      { href: '/admin/team', label: 'Team Directory', icon: UserCheck },
      { href: '/admin/transparency', label: 'Governance Docs', icon: ShieldCheck },
      { href: '/admin/media', label: 'Media Library', icon: Image },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/users', label: 'Staff Accounts', icon: Shield },
      { href: '/admin/chatbot', label: 'AI Chatbot', icon: MessageSquare },
      { href: '/admin/email', label: 'Email Dispatcher', icon: Mail },
      { href: '/admin/audit-log', label: 'Audit Logs', icon: Terminal },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function SidebarNavigation() {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
      {navSections.map((section) => (
        <div key={section.label}>
          <div className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted/50">
            {section.label}
          </div>
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <SidebarNavItem key={item.href} item={item} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
