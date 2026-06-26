'use client'

import { useState, useMemo } from 'react'
import { AdminTableShell, TableSearch, TableFilter, EmptyRow, Th, StatusBadge, TablePagination } from '@/components/admin/AdminTable'
import { VolunteerStatusActions } from '@/components/admin/VolunteerStatusActions'

type Volunteer = {
  id: string
  name: string
  email: string
  phone: string | null
  location: string | null
  status: string
  appliedAt: string | number
}

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  active:   'bg-green-100 text-green-700',
  pending:  'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
}

export function VolunteersTable({ volunteers }: { volunteers: Volunteer[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() => {
    return volunteers.filter((v) => {
      const matchSearch =
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase()) ||
        (v.location ?? '').toLowerCase().includes(search.toLowerCase())
      const matchStatus = !statusFilter || v.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [volunteers, search, statusFilter])

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

  const pending = volunteers.filter((v) => v.status === 'pending').length

  return (
    <AdminTableShell
      title="Volunteers"
      subtitle={`${volunteers.length} total application${volunteers.length !== 1 ? 's' : ''}${pending ? ` · ${pending} pending review` : ''}`}
      filterBar={
        <>
          <TableSearch value={search} onChange={setSearch} placeholder="Search by name or email…" />
          <TableFilter
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              { label: 'Pending', value: 'pending' },
              { label: 'Approved', value: 'approved' },
              { label: 'Active', value: 'active' },
              { label: 'Rejected', value: 'rejected' },
            ]}
          />
        </>
      }
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Location</Th>
            <Th>Status / Actions</Th>
            <Th>Applied</Th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <EmptyRow colSpan={6} message="No volunteer applications found." />
          ) : (
            paginated.map((vol) => (
              <tr key={vol.id} className="border-b border-border transition-colors hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">{vol.name}</td>
                <td className="px-4 py-3 text-brand-muted">{vol.email}</td>
                <td className="px-4 py-3 text-brand-muted">{vol.phone || '—'}</td>
                <td className="px-4 py-3 text-brand-muted">{vol.location || '—'}</td>
                <td className="px-4 py-3">
                  <VolunteerStatusActions id={vol.id} currentStatus={vol.status} />
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {new Date(vol.appliedAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
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

