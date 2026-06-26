'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Users, Pencil } from 'lucide-react'
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton'
import { AdminTableShell, TableSearch, TableFilter, Th, EmptyRow, StatusBadge, TablePagination } from '@/components/admin/AdminTable'

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

const STATUS_COLORS: Record<string, string> = {
  upcoming:  'bg-blue-100 text-blue-700',
  ongoing:   'bg-green-100 text-green-700',
  past:      'bg-secondary text-muted-foreground',
  cancelled: 'bg-red-100 text-red-600',
}

export function EventsTableClient({ events }: { events: Event[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() =>
    events.filter((e) => {
      const q = search.toLowerCase()
      return (
        (!search || e.title.toLowerCase().includes(q) || (e.location ?? '').toLowerCase().includes(q)) &&
        (!statusFilter || e.status === statusFilter)
      )
    }), [events, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginated = useMemo(() => {
    return filtered.slice(startIndex, endIndex)
  }, [filtered, startIndex, endIndex])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <AdminTableShell
      title="Events"
      subtitle={`${events.length} event${events.length !== 1 ? 's' : ''}`}
      headerAction={
        <Button asChild variant="cta">
          <Link href="/admin/events/new"><Plus className="mr-2 h-4 w-4" />New Event</Link>
        </Button>
      }
      filterBar={
        <>
          <TableSearch value={search} onChange={setSearch} placeholder="Search events…" />
          <TableFilter
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              { label: 'Upcoming', value: 'upcoming' },
              { label: 'Ongoing', value: 'ongoing' },
              { label: 'Past', value: 'past' },
              { label: 'Cancelled', value: 'cancelled' },
            ]}
          />
        </>
      }
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            <Th>Title</Th>
            <Th>Date</Th>
            <Th>Location</Th>
            <Th>Registrations</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <EmptyRow colSpan={6} message="No events found." />
          ) : (
            paginated.map((event) => (
              <tr key={event.id} className="border-b border-border transition-colors hover:bg-muted/40">
                <td className="max-w-[240px] truncate px-4 py-3 font-medium text-foreground" title={event.title}>
                  {event.title}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-brand-muted">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-brand-muted">{event.location || '—'}</td>
                <td className="px-4 py-3 text-brand-muted">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {event.registrationsCount}{event.capacity ? ` / ${event.capacity}` : ''}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={event.status} colorMap={STATUS_COLORS} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-brand-primary hover:bg-brand-primary/8 transition-colors"
                    >
                      <Pencil className="h-3 w-3" />Edit
                    </Link>
                    <DeleteConfirmButton id={event.id} endpoint="/api/admin/events" label="Event" />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filtered.length}
      />
    </AdminTableShell>
  )
}

