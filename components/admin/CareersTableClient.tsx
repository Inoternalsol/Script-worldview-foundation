'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil } from 'lucide-react'
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton'
import { AdminTableShell, TableSearch, TableFilter, Th, EmptyRow, StatusBadge, TablePagination } from '@/components/admin/AdminTable'

type Job = {
  id: string
  title: string
  department: string | null
  location: string | null
  type: string
  status: string
  deadline: string | number | null
  createdAt: string | number
}

const STATUS_COLORS: Record<string, string> = {
  open:     'bg-green-100 text-green-700',
  closed:   'bg-amber-100 text-amber-700',
  archived: 'bg-secondary text-muted-foreground',
}

function formatType(t: string) {
  return t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function CareersTableClient({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() =>
    jobs.filter((j) => {
      const q = search.toLowerCase()
      return (
        (!search ||
          j.title.toLowerCase().includes(q) ||
          (j.department ?? '').toLowerCase().includes(q) ||
          (j.location ?? '').toLowerCase().includes(q)) &&
        (!statusFilter || j.status === statusFilter)
      )
    }), [jobs, search, statusFilter])

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
      title="Careers"
      subtitle={`${jobs.length} job posting${jobs.length !== 1 ? 's' : ''}`}
      headerAction={
        <Button asChild variant="cta">
          <Link href="/admin/careers/new"><Plus className="mr-2 h-4 w-4" />New Job</Link>
        </Button>
      }
      filterBar={
        <>
          <TableSearch value={search} onChange={setSearch} placeholder="Search jobs…" />
          <TableFilter
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              { label: 'Open', value: 'open' },
              { label: 'Closed', value: 'closed' },
              { label: 'Archived', value: 'archived' },
            ]}
          />
        </>
      }
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            <Th>Title</Th>
            <Th>Department</Th>
            <Th>Type</Th>
            <Th>Location</Th>
            <Th>Status</Th>
            <Th>Deadline</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <EmptyRow colSpan={7} message="No job postings found." />
          ) : (
            paginated.map((job) => (
              <tr key={job.id} className="border-b border-border transition-colors hover:bg-muted/40">
                <td className="max-w-[220px] truncate px-4 py-3 font-medium text-foreground" title={job.title}>
                  {job.title}
                </td>
                <td className="px-4 py-3 text-brand-muted">{job.department || '—'}</td>
                <td className="px-4 py-3 text-brand-muted">{formatType(job.type)}</td>
                <td className="px-4 py-3 text-brand-muted">{job.location || '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={job.status} colorMap={STATUS_COLORS} />
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/careers/${job.id}`}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-brand-primary hover:bg-brand-primary/8 transition-colors"
                    >
                      <Pencil className="h-3 w-3" />Edit
                    </Link>
                    <DeleteConfirmButton id={job.id} endpoint="/api/admin/careers" label="Job" />
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

