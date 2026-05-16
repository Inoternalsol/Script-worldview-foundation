import { adminFetch } from '@/lib/admin-api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'

type Event = {
  id: string
  title: string
  slug: string
  date: string | number
  location: string | null
  status: string
  registrationsCount: number
  capacity: number | null
}

async function getEvents(): Promise<Event[]> {
  try {
    const res = await adminFetch('/events')
    return res.data
  } catch {
    return []
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-700'
    case 'ongoing':
      return 'bg-green-100 text-green-700'
    case 'past':
      return 'bg-gray-100 text-gray-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function EventsAdminPage() {
  const events = await getEvents()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Events</h1>
          <p className="mt-1 text-sm text-brand-muted">
            {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" /> New Event
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-gray-50/50">
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Registrations</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-brand-muted">
                    No events yet. Create your first event!
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="border-b border-black/5 transition-colors hover:bg-gray-50/50">
                    <td className="max-w-[250px] truncate px-4 py-3 font-medium text-foreground">
                      {event.title}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{event.location || '—'}</td>
                    <td className="px-4 py-3 text-brand-muted">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> {event.registrationsCount}
                        {event.capacity ? ` / ${event.capacity}` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-sm font-medium text-brand-primary hover:underline"
                      >
                        Edit
                      </Link>
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
