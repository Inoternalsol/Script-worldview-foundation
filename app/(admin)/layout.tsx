import Link from 'next/link'
import { auth } from '@/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <div className="flex min-h-[calc(100vh-1px)] bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-black/10 bg-white md:flex md:flex-col">
        <div className="px-6 py-6">
          <Link href="/" className="font-heading text-lg font-semibold text-brand-primary">
            Script Worldview
          </Link>
          <div className="mt-2 text-xs text-brand-muted">
            {session?.user?.email ?? 'Signed in'}
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3 pb-6">
          <Link
            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-brand-primary/5"
            href="/admin"
          >
            Dashboard
          </Link>
          <Link
            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-brand-primary/5"
            href="/admin/content/pages"
          >
            Content
          </Link>
          <Link
            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-brand-primary/5"
            href="/admin/media"
          >
            Media
          </Link>
          <Link
            className="rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-brand-primary/5"
            href="/admin/users"
          >
            Users
          </Link>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-black/10 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="truncate font-heading text-lg font-semibold text-foreground">
                Admin
              </div>
              <div className="truncate text-sm text-brand-muted">
                {session?.user?.role ? `Role: ${session.user.role}` : 'Authenticated'}
              </div>
            </div>
            <Link
              href="/api/auth/signout"
              className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-foreground hover:bg-black/5"
            >
              Sign out
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}

