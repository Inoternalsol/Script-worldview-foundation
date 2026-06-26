import { adminFetch } from '@/lib/admin-api'
import { EventsTableClient } from '@/components/admin/EventsTableClient'

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
    return res.data ?? []
  } catch {
    return []
  }
}

export default async function EventsAdminPage() {
  const events = await getEvents()
  return <EventsTableClient events={events} />
}
