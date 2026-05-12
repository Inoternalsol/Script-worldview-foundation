import { auth } from '@/auth'

export default async function AdminDashboardPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}. This is your operations hub.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-card">
          <div className="text-sm font-medium text-brand-muted">System</div>
          <div className="mt-1 font-heading text-xl font-semibold text-foreground">
            Ready
          </div>
          <div className="mt-2 text-sm text-brand-muted">
            Authentication and API wiring are in place.
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-card">
          <div className="text-sm font-medium text-brand-muted">Database</div>
          <div className="mt-1 font-heading text-xl font-semibold text-foreground">
            Connected
          </div>
          <div className="mt-2 text-sm text-brand-muted">
            D1 schema is scaffolded and ready for migrations.
          </div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-6 shadow-card">
          <div className="text-sm font-medium text-brand-muted">Next Steps</div>
          <div className="mt-1 font-heading text-xl font-semibold text-foreground">
            Build Pages
          </div>
          <div className="mt-2 text-sm text-brand-muted">
            Public layout, navigation, and reusable components are next.
          </div>
        </div>
      </div>
    </div>
  )
}

