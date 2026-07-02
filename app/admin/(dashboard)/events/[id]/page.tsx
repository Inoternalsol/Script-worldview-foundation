'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { EventRegistrationsTable } from '@/components/admin/EventRegistrationsTable'

type Event = {
  id: string
  title: string
  slug: string
  date: string | number
  endDate: string | number | null
  location: string | null
  address: string | null
  description: string
  capacity: number | null
  status: string
}

function formatDateTimeLocal(epoch: string | number) {
  if (!epoch) return ''
  const d = new Date(epoch)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/admin/events/${id}`)
        if (!res.ok) throw new Error('Failed to load event')
        const data = await res.json()
        setEvent(data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const body = {
      title: form.get('title') as string,
      slug: form.get('slug') as string,
      date: new Date(form.get('date') as string).getTime(),
      endDate: form.get('endDate') ? new Date(form.get('endDate') as string).getTime() : undefined,
      location: (form.get('location') as string) || undefined,
      address: (form.get('address') as string) || undefined,
      description: form.get('description') as string,
      capacity: form.get('capacity') ? parseInt(form.get('capacity') as string) : undefined,
      status: form.get('status') as string,
    }

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || data.error || 'Failed to update event')
      }

      router.push('/admin/events')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-brand-muted">Loading event data...</div>
  if (!event && error) return <div className="p-6 text-center text-red-600">Error: {error}</div>
  if (!event) return <div className="p-6 text-center text-brand-muted">Event not found.</div>

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/events"
        className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Edit Event</h1>
        <p className="mt-1 text-sm text-brand-muted">Modify the details of your event or webinar.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" defaultValue={event.title} required placeholder="Event title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" defaultValue={event.slug} required placeholder="event-slug" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              title="Status"
              defaultValue={event.status}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Start Date & Time *</Label>
            <Input id="date" name="date" type="datetime-local" defaultValue={formatDateTimeLocal(event.date)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date & Time</Label>
            <Input id="endDate" name="endDate" type="datetime-local" defaultValue={event.endDate ? formatDateTimeLocal(event.endDate) : ''} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={event.location || ''} placeholder="Venue name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input id="capacity" name="capacity" type="number" defaultValue={event.capacity || ''} placeholder="Max attendees" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={event.address || ''} placeholder="Full address" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description * (HTML)</Label>
            <Textarea id="description" name="description" defaultValue={event.description} rows={8} required placeholder="Event description..." />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="cta" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      <EventRegistrationsTable eventId={event.id} eventTitle={event.title} />
    </div>
  )
}
