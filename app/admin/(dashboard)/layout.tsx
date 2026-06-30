import Link from 'next/link'
import { auth } from '@/auth'
import { SignOutButton } from '@/components/admin/SignOutButton'
import { SidebarNavigation } from '@/components/admin/SidebarNavigation'
import { ThemeToggle } from '@/components/public/shared/ThemeToggle'

import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session = null
  try {
    session = await auth()
  } catch (err) {
    console.error('AdminLayout auth verification error:', err)
  }
  const user = session?.user as any

  return (
    <div className="flex min-h-[calc(100vh-1px)] bg-[#F7F8FA]">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card shadow-[1px_0_0_0_rgba(0,0,0,0.04)] md:flex md:flex-col">
        {/* Brand */}
        <div className="border-b border-border px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white text-xs font-black">
              SWF
            </div>
            <div>
              <div className="font-heading text-sm font-bold text-foreground leading-none">Admin Panel</div>
              <div className="text-[11px] text-brand-muted mt-0.5 leading-none">Script Worldview</div>
            </div>
          </Link>
        </div>

        {/* User pill */}
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

        {/* Navigation */}
        <SidebarNavigation />

        {/* Sign out */}
        <div className="border-t border-border p-3">
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-4 py-3.5 backdrop-blur-sm md:px-8">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="truncate font-heading text-base font-semibold text-foreground">
                Script Worldview Foundation
              </div>
              <div className="truncate text-xs text-brand-muted">
                Content Management System
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-black/4"
              >
                View Live Site ↗
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 md:px-8">
          <AdminBreadcrumb />
          {children}
        </main>
      </div>
    </div>
  )
}

