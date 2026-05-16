import { adminFetch } from '@/lib/admin-api'
import { Badge } from '@/components/ui/badge'

type Volunteer = {
  id: string
  name: string
  email: string
  phone: string | null
  location: string | null
  skillsJson: string | null
  availabilityJson: string | null
  languages: string | null
  motivation: string | null
  howDidYouHear: string | null
  status: string
  appliedAt: string | number
}

async function getVolunteers(): Promise<Volunteer[]> {
  try {
    const res = await adminFetch('/volunteers')
    return res.data
  } catch {
    return []
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'approved':
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'rejected':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function VolunteersAdminPage() {
  const volunteers = await getVolunteers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Volunteers</h1>
          <p className="mt-1 text-sm text-brand-muted">
            {volunteers.length} total application{volunteers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-gray-50/50">
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Applied</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-brand-muted">
                    No volunteer applications yet.
                  </td>
                </tr>
              ) : (
                volunteers.map((vol) => (
                  <tr key={vol.id} className="border-b border-black/5 transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-foreground">{vol.name}</td>
                    <td className="px-4 py-3 text-brand-muted">{vol.email}</td>
                    <td className="px-4 py-3 text-brand-muted">{vol.phone || '—'}</td>
                    <td className="px-4 py-3 text-brand-muted">{vol.location || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(vol.status)}`}>
                        {vol.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {new Date(vol.appliedAt).toLocaleDateString('en-US', {
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
