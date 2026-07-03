'use client'

import { useState, useMemo } from 'react'
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
  AdminTableShell,
  TableSearch,
  TableFilter,
  Th,
  EmptyRow,
  StatusBadge,
  TablePagination,
} from '@/components/admin/AdminTable'
import {
  Eye,
  Mail,
  Phone,
  MessageCircle,
  Check,
  Copy,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Building2,
  Calendar,
} from 'lucide-react'

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
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  new: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

export function ContactsTableClient({ contacts: initialContacts }: { contacts: Contact[] }) {
  const [contactsList, setContactsList] = useState<Contact[]>(initialContacts)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return contactsList.filter((c) => {
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.subject ?? '').toLowerCase().includes(q) ||
        (c.message ?? '').toLowerCase().includes(q)
      const matchStatus = !statusFilter || c.status === statusFilter
      const matchDept = !deptFilter || c.department === deptFilter
      return matchSearch && matchStatus && matchDept
    })
  }, [contactsList, search, statusFilter, deptFilter])

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

  const handleCopyText = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast({
      title: 'Copied to clipboard',
      description: `${label} copied to clipboard.`,
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Failed to update status')

      setContactsList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      )
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus })
      }

      toast({
        title: 'Status Updated',
        description: `Message status changed to ${newStatus.replace('_', ' ')}.`,
      })
    } catch (err: any) {
      toast({
        title: 'Error updating status',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminTableShell
        title="Contact Messages"
        subtitle={`${contactsList.length} message${contactsList.length !== 1 ? 's' : ''} received from contact forms across the website`}
        filterBar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search messages, name, email…" />
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
              <Th>Sender</Th>
              <Th>Subject & Message Snippet</Th>
              <Th>Department</Th>
              <Th>Status</Th>
              <Th>Received</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <EmptyRow colSpan={6} message="No contact messages found." />
            ) : (
              paginated.map((msg) => (
                <tr
                  key={msg.id}
                  className="border-b border-border transition-colors hover:bg-muted/40 cursor-pointer"
                  onClick={() => setSelectedMessage(msg)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{msg.name}</div>
                    <div className="text-xs text-brand-muted flex items-center gap-1.5 mt-0.5">
                      <span>{msg.email}</span>
                      {msg.phone && <span className="text-emerald-600 dark:text-emerald-400 font-medium">· {msg.phone}</span>}
                    </div>
                  </td>
                  <td className="max-w-[280px] px-4 py-3">
                    <div className="font-medium text-foreground truncate" title={msg.subject || ''}>
                      {msg.subject || 'General Inquiry'}
                    </div>
                    <div className="text-xs text-brand-muted truncate mt-0.5">
                      {msg.message}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-brand-muted">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-gray-400" />
                      {msg.department || 'general'}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      aria-label="Update message status"
                      value={msg.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize border-0 cursor-pointer focus:ring-2 focus:ring-emerald-500 ${STATUS_COLORS[msg.status] || 'bg-gray-100 text-gray-700'}`}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-brand-muted whitespace-nowrap text-xs">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        onClick={() => setSelectedMessage(msg)}
                        title="Read complete message"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DeleteConfirmButton
                        id={msg.id}
                        endpoint="/api/admin/contacts"
                        label="Message"
                      />
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

      {/* Message Viewer & Communication Suite Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                    {selectedMessage.department || 'General'} Inquiry
                  </span>
                  <StatusBadge status={selectedMessage.status} colorMap={STATUS_COLORS} />
                </div>
                <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  {selectedMessage.subject || 'General Inquiry'}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedMessage(null)}
                className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Close viewer"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Sender Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-gray-100 dark:border-gray-800 text-sm">
              <div>
                <span className="text-xs text-gray-400 block font-medium">From</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">Received At</span>
                <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                {/* Email Chip */}
                <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60">
                  <Mail className="h-3.5 w-3.5 text-emerald-600" />
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Inquiry')}`}
                    className="text-xs font-medium text-gray-800 hover:text-emerald-600 dark:text-gray-200"
                  >
                    {selectedMessage.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyText(selectedMessage.email, `${selectedMessage.id}-email`, 'Email')}
                    className="text-gray-400 hover:text-gray-600 ml-1"
                    title="Copy email address"
                  >
                    {copiedId === `${selectedMessage.id}-email` ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>

                {/* Phone Chip */}
                {selectedMessage.phone && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60">
                    <Phone className="h-3.5 w-3.5 text-blue-600" />
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-xs font-medium text-gray-800 hover:text-blue-600 dark:text-gray-200"
                    >
                      {selectedMessage.phone}
                    </a>
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 ml-1"
                      title="Chat on WhatsApp"
                      aria-label="Chat on WhatsApp"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyText(selectedMessage.phone!, `${selectedMessage.id}-phone`, 'Phone')}
                      className="text-gray-400 hover:text-gray-600 ml-1"
                      title="Copy phone number"
                    >
                      {copiedId === `${selectedMessage.id}-phone` ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Message Body Content */}
            <div className="my-4 flex-1 overflow-y-auto rounded-xl bg-gray-50/80 p-5 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Message Content
              </h4>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-sans">
                {selectedMessage.message}
              </div>
            </div>

            {/* Modal Actions / 1-Click Communication Suite */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 font-medium">Change Status:</span>
                <select
                  aria-label="Update status from modal"
                  value={selectedMessage.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="new">Mark as New</option>
                  <option value="in_progress">Mark In Progress</option>
                  <option value="resolved">Mark Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.open(
                      `mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Inquiry')}&body=${encodeURIComponent(`Hi ${selectedMessage.name},\n\nThank you for reaching out to Script Worldview Foundation regarding "${selectedMessage.subject || 'your inquiry'}".\n\n`)}`,
                      '_blank'
                    )
                  }}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white border-transparent text-xs"
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Reply via Email
                </Button>

                {selectedMessage.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(
                        `https://wa.me/${selectedMessage.phone!.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedMessage.name}, we received your inquiry at Script Worldview Foundation regarding "${selectedMessage.subject || 'your inquiry'}".`)}`,
                        '_blank'
                      )
                    }}
                    className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 text-xs dark:hover:bg-emerald-950/40"
                  >
                    <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                    Reply on WhatsApp
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
