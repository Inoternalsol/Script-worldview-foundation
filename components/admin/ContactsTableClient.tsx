'use client'

import { useState, useMemo } from 'react'
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton'
import {
  AdminTableShell,
  TableSearch,
  TableFilter,
  Th,
  EmptyRow,
  StatusBadge,
  TablePagination,
} from '@/components/admin/AdminTable'

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  department: string | null
  message: string
  type: string
  status: string
  createdAt: string | number
}

const STATUS_COLORS: Record<string, string> = {
  resolved: 'bg-green-100 text-green-700',
  in_progress: 'bg-blue-100 text-blue-700',
  new: 'bg-amber-100 text-amber-700',
}

export function ContactsTableClient({ contacts }: { contacts: Contact[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.subject ?? '').toLowerCase().includes(q)
      const matchStatus = !statusFilter || c.status === statusFilter
      const matchDept = !deptFilter || c.department === deptFilter
      return matchSearch && matchStatus && matchDept
    })
  }, [contacts, search, statusFilter, deptFilter])

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
      title="Contact Messages"
      subtitle={`${contacts.length} message${contacts.length !== 1 ? 's' : ''}`}
      filterBar={
        <>
          <TableSearch value={search} onChange={setSearch} placeholder="Search by name, email, subject…" />
          <TableFilter
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              { label: 'New', value: 'new' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Resolved', value: 'resolved' },
            ]}
          />
          <TableFilter
            value={deptFilter}
            onChange={setDeptFilter}
            placeholder="All Departments"
            options={[
              { label: 'General', value: 'general' },
              { label: 'Education', value: 'education' },
              { label: 'Humanitarian', value: 'humanitarian' },
              { label: 'Community', value: 'community' },
              { label: 'HR', value: 'hr' },
              { label: 'Press', value: 'press' },
              { label: 'Partnership', value: 'partnership' },
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
            <Th>Subject</Th>
            <Th>Department</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <EmptyRow colSpan={7} message="No contact messages found." />
          ) : (
            paginated.map((msg) => (
              <tr key={msg.id} className="border-b border-border transition-colors hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">{msg.name}</td>
                <td className="px-4 py-3 text-brand-muted">{msg.email}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-brand-muted" title={msg.subject || ''}>
                  {msg.subject || '—'}
                </td>
                <td className="px-4 py-3 capitalize text-brand-muted">{msg.department || '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={msg.status} colorMap={STATUS_COLORS} />
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {new Date(msg.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <DeleteConfirmButton
                    id={msg.id}
                    endpoint="/api/admin/contacts"
                    label="Message"
                  />
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
