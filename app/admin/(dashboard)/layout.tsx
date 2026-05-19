import Link from 'next/link'
import { auth } from '@/auth'
import {
  LayoutDashboard,
  Users,
  Heart,
  Mail,
  FileText,
  Calendar,
  Briefcase,
  Settings,
  LogOut,
  ChevronRight,
  MessageSquare,
  Image,
  Shield,
  Terminal,
  TrendingUp,
} from 'lucide-react'

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { href: '/admin/volunteers', label: 'Volunteers', icon: Users },
      { href: '/admin/donations', label: 'Donations', icon: Heart },
      { href: '/admin/contacts', label: 'Messages', icon: MessageSquare },
      { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
      { href: '/admin/events', label: 'Events', icon: Calendar },
      { href: '/admin/careers', label: 'Careers', icon: Briefcase },
      { href: '/admin/media', label: 'Media Library', icon: Image },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/users', label: 'Staff Accounts', icon: Shield },
      { href: '/admin/chatbot', label: 'AI Chatbot', icon: MessageSquare },
      { href: '/admin/audit-log', label: 'Audit Logs', icon: Terminal },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="flex min-h-[calc(100vh-1px)] bg-gray-50">
      <aside className="hidden w-64 shrink-0 border-r border-black/10 bg-white md:flex md:flex-col">
        <div className="border-b border-black/5 px-6 py-5">
          <Link href="/" className="font-heading text-lg font-bold text-brand-primary">
            SWF Admin
          </Link>
          <div className="mt-1 truncate text-xs text-brand-muted">
            {session?.user?.email ?? 'Signed in'}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-brand-muted/60">
                {section.label}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-brand-primary/5 hover:text-brand-primary"
                    href={item.href}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-black/5 p-3">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-black/10 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="truncate font-heading text-lg font-semibold text-foreground">
                Admin Panel
              </div>
              <div className="truncate text-sm text-brand-muted">
                {session?.user?.role ? `Role: ${session.user.role}` : 'Authenticated'}
              </div>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-black/5"
            >
              View Site
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}
