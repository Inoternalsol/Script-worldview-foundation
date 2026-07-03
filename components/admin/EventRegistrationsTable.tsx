'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import {
  Download,
  Users,
  Mail,
  Phone,
  Building2,
  Plus,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Trash2,
  Search,
  Loader2,
} from 'lucide-react'

type Registration = {
  id: string
  eventId: string
  name: string
  email: string
  phone: string | null
  organization: string | null
  roleTitle: string | null
  dietaryNeeds: string | null
  accessibilityNeeds: string | null
  status: 'confirmed' | 'waitlist' | 'cancelled'
  registeredAt?: string | number
  createdAt?: string | number
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  waitlist: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function EventRegistrationsTable({
  eventId,
  eventTitle,
}: {
  eventId: string
  eventTitle: string
}) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Add Attendee Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [adding, setAdding] = useState(false)

  const loadRegistrations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/events/${eventId}/registrations`)
      if (!res.ok) {
        throw new Error('Could not fetch registrations')
      }
      const data = await res.json()
      setRegistrations(Array.isArray(data.data) ? data.data : [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRegistrations()
  }, [eventId])

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        reg.name.toLowerCase().includes(query) ||
        reg.email.toLowerCase().includes(query) ||
        (reg.phone && reg.phone.toLowerCase().includes(query)) ||
        (reg.organization && reg.organization.toLowerCase().includes(query)) ||
        (reg.roleTitle && reg.roleTitle.toLowerCase().includes(query))

      const matchesStatus = statusFilter === 'all' || reg.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [registrations, searchQuery, statusFilter])

  const copyToClipboard = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast({
      title: `${label} copied!`,
      description: text,
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyAllEmails = () => {
    const emails = filteredRegistrations
      .map((r) => r.email)
      .filter(Boolean)
      .join(', ')
    if (!emails) return
    navigator.clipboard.writeText(emails)
    toast({
      title: 'Copied all attendee emails!',
      description: `Copied ${filteredRegistrations.length} email addresses ready for BCC.`,
    })
  }

  const exportCSV = () => {
    if (filteredRegistrations.length === 0) return

    const headers = [
      'Name',
      'Email',
      'Phone',
      'Organization',
      'Role',
      'Status',
      'Dietary Needs',
      'Accessibility Needs',
      'Registered At',
    ]
    const rows = filteredRegistrations.map((r) => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.organization || '').replace(/"/g, '""')}"`,
      `"${(r.roleTitle || '').replace(/"/g, '""')}"`,
      `"${r.status || 'confirmed'}"`,
      `"${(r.dietaryNeeds || '').replace(/"/g, '""')}"`,
      `"${(r.accessibilityNeeds || '').replace(/"/g, '""')}"`,
      `"${new Date(r.registeredAt || r.createdAt || Date.now()).toLocaleString()}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-attendees.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleStatusChange = async (regId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}/registrations/${regId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')

      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: newStatus as any } : r))
      )
      toast({
        title: 'Status Updated',
        description: `Attendee status changed to ${newStatus}.`,
      })
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Could not update attendee status.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (regId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete registration for "${name}"?`)) return
    try {
      const res = await fetch(`/api/admin/events/${eventId}/registrations/${regId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete registration')

      setRegistrations((prev) => prev.filter((r) => r.id !== regId))
      toast({
        title: 'Attendee Deleted',
        description: `${name} has been removed from the attendee roster.`,
      })
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Could not delete registration.',
        variant: 'destructive',
      })
    }
  }

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAdding(true)
    const form = new FormData(e.currentTarget)
    const body = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      phone: (form.get('phone') as string) || null,
      organization: (form.get('organization') as string) || null,
      roleTitle: (form.get('roleTitle') as string) || null,
      status: form.get('status') as string,
      dietaryNeeds: (form.get('dietaryNeeds') as string) || null,
      accessibilityNeeds: (form.get('accessibilityNeeds') as string) || null,
    }

    try {
      const res = await fetch(`/api/admin/events/${eventId}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || data.error || 'Failed to add attendee')
      }
      const { data: newReg } = await res.json()
      setRegistrations((prev) => [newReg, ...prev])
      setShowAddModal(false)
      toast({
        title: 'Attendee Registered',
        description: `${newReg.name} has been added successfully.`,
      })
    } catch (err: any) {
      toast({
        title: 'Registration Error',
        description: err.message || 'Could not register attendee.',
        variant: 'destructive',
      })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div
      id="attendees"
      className="mt-8 scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-card space-y-6"
    >
      {/* Header section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Users className="h-5 w-5 text-brand-primary" />
            Attendees & Roster Management
          </div>
          <p className="text-sm text-brand-muted mt-1">
            {loading
              ? 'Loading attendees...'
              : `${registrations.length} total attendee${
                  registrations.length !== 1 ? 's' : ''
                } registered (${
                  registrations.filter((r) => r.status !== 'cancelled').length
                } active)`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filteredRegistrations.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={copyAllEmails}
                className="flex items-center gap-1.5 text-xs"
                title="Copy all visible attendee emails to clipboard"
              >
                <Copy className="h-3.5 w-3.5 text-brand-primary" />
                Copy All Emails
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 text-xs"
              >
                <a
                  href={`mailto:?bcc=${encodeURIComponent(
                    filteredRegistrations.map((r) => r.email).filter(Boolean).join(',')
                  )}&subject=${encodeURIComponent(`Regarding: ${eventTitle}`)}`}
                >
                  <Mail className="h-3.5 w-3.5 text-brand-primary" />
                  Email All (BCC)
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCSV}
                className="flex items-center gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5 text-brand-primary" />
                Export CSV
              </Button>
            </>
          )}
          <Button
            variant="cta"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-xs"
          >
            <Plus className="h-4 w-4" />
            Add Attendee
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, or organization..."
            className="pl-9 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by Status"
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring sm:w-44"
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed Only</option>
          <option value="waitlist">Waitlist Only</option>
          <option value="cancelled">Cancelled Only</option>
        </select>
      </div>

      {/* Table section */}
      <div className="overflow-x-auto rounded-xl border border-border">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-brand-muted">
            <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
            Loading attendee roster...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600">
            Failed to load attendees: {error}
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="py-12 text-center text-sm text-brand-muted">
            {searchQuery || statusFilter !== 'all'
              ? 'No attendees match your search or filter.'
              : 'No attendees registered for this event yet.'}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                <th className="px-4 py-3">Attendee</th>
                <th className="px-4 py-3">Contact Info</th>
                <th className="px-4 py-3">Organization / Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Special Needs</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRegistrations.map((reg) => {
                const cleanPhone = reg.phone?.replace(/[^0-9+]/g, '') || ''
                return (
                  <tr key={reg.id} className="hover:bg-muted/30 transition-colors">
                    {/* Attendee Name */}
                    <td className="px-4 py-3.5 font-medium text-foreground">
                      <div>{reg.name}</div>
                    </td>

                    {/* Interactive Contact Info */}
                    <td className="px-4 py-3.5 space-y-1.5">
                      <div className="flex items-center gap-2 group">
                        <a
                          href={`mailto:${reg.email}`}
                          className="flex items-center gap-1.5 text-xs text-foreground hover:text-brand-primary hover:underline"
                          title="Click to email"
                        >
                          <Mail className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                          <span>{reg.email}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(reg.email, `email-${reg.id}`, 'Email')}
                          className="text-brand-muted hover:text-foreground p-0.5 rounded transition-colors"
                          title="Copy Email"
                        >
                          {copiedId === `email-${reg.id}` ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>

                      {reg.phone && (
                        <div className="flex items-center gap-2 group">
                          <a
                            href={`tel:${reg.phone}`}
                            className="flex items-center gap-1.5 text-xs text-foreground hover:text-brand-primary hover:underline"
                            title="Click to call"
                          >
                            <Phone className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                            <span>{reg.phone}</span>
                          </a>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 p-0.5 rounded"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => copyToClipboard(reg.phone!, `phone-${reg.id}`, 'Phone')}
                            className="text-brand-muted hover:text-foreground p-0.5 rounded transition-colors"
                            title="Copy Phone"
                          >
                            {copiedId === `phone-${reg.id}` ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Organization / Role */}
                    <td className="px-4 py-3.5 text-brand-muted">
                      {reg.organization || reg.roleTitle ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Building2 className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                          <span>
                            {[reg.organization, reg.roleTitle].filter(Boolean).join(' • ')}
                          </span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-3.5">
                      <select
                        value={reg.status || 'confirmed'}
                        onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                        aria-label={`Status for ${reg.name}`}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-ring ${
                          STATUS_COLORS[reg.status || 'confirmed'] || STATUS_COLORS.confirmed
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="waitlist">Waitlist</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Special Needs */}
                    <td className="px-4 py-3.5 text-xs text-brand-muted max-w-[180px]">
                      {reg.dietaryNeeds && (
                        <div>
                          <span className="font-medium text-foreground">Diet:</span>{' '}
                          {reg.dietaryNeeds}
                        </div>
                      )}
                      {reg.accessibilityNeeds && (
                        <div>
                          <span className="font-medium text-foreground">Access:</span>{' '}
                          {reg.accessibilityNeeds}
                        </div>
                      )}
                      {!reg.dietaryNeeds && !reg.accessibilityNeeds && (
                        <span className="text-brand-muted/60">None</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-xs text-brand-muted whitespace-nowrap">
                      {new Date(reg.registeredAt || reg.createdAt || Date.now()).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(reg.id, reg.name)}
                        className="h-8 w-8 p-0 text-brand-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Delete registration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Manual Add Attendee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl border border-border animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-heading text-lg font-bold text-foreground">
              Add New Attendee
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Manually register an attendee for &ldquo;{eventTitle}&rdquo;.
            </p>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Jane Doe"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+234 800 000 0000"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="status" className="text-xs">
                    Registration Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue="confirmed"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="waitlist">Waitlist</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="organization" className="text-xs">
                    Organization
                  </Label>
                  <Input
                    id="organization"
                    name="organization"
                    placeholder="Company or NGO"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="roleTitle" className="text-xs">
                    Job Title / Role
                  </Label>
                  <Input
                    id="roleTitle"
                    name="roleTitle"
                    placeholder="Program Officer"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="dietaryNeeds" className="text-xs">
                    Dietary Requirements
                  </Label>
                  <Input
                    id="dietaryNeeds"
                    name="dietaryNeeds"
                    placeholder="Vegetarian, Halal, Gluten-free..."
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="accessibilityNeeds" className="text-xs">
                    Accessibility Needs
                  </Label>
                  <Input
                    id="accessibilityNeeds"
                    name="accessibilityNeeds"
                    placeholder="Wheelchair access, Sign language..."
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  disabled={adding}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="cta" disabled={adding}>
                  {adding ? 'Adding...' : 'Register Attendee'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
