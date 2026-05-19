import { adminFetch } from '@/lib/admin-api'

type Subscriber = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  status: string
  subscribedAt: string | number
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const res = await adminFetch('/newsletter')
    return res.data
  } catch {
    return []
  }
}

export default async function NewsletterAdminPage() {
  const subscribers = await getSubscribers()
  const activeCount = subscribers.filter((s) => s.status === 'active').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Newsletter Subscribers</h1>
        <p className="mt-1 text-sm text-brand-muted">
          {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''} · {activeCount} active
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-gray-50/50">
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-brand-muted">
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-black/5 transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-foreground">{sub.email}</td>
                    <td className="px-4 py-3 text-brand-muted">
                      {[sub.firstName, sub.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {new Date(sub.subscribedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
