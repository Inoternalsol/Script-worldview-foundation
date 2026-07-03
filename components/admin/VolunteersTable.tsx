'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import {
  Download,
  Users,
  Mail,
  Phone,
  Plus,
  Copy,
  Check,
  MessageCircle,
  Trash2,
  Search,
} from 'lucide-react'
import Link from 'next/link'
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

export function VolunteersTable({ volunteers: initialVolunteers }: { volunteers: Volunteer[] }) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [adding, setAdding] = useState(false)

  const filtered = useMemo(() => {
    return volunteers.filter((v) => {
      const matchSearch =
        !search ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.email.toLowerCase().includes(search.toLowerCase()) ||
        (v.phone && v.phone.toLowerCase().includes(search.toLowerCase())) ||
        (v.location && v.location.toLowerCase().includes(search.toLowerCase()))
      const matchStatus = !statusFilter || v.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [volunteers, search, statusFilter])

  const handleCopyText = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast({
      title: 'Copied to clipboard',
      description: `${label} copied to clipboard.`,
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCopyAllEmails = () => {
    const emails = filtered.map((v) => v.email).filter(Boolean).join(', ')
    if (!emails) {
      toast({
        title: 'No emails found',
        description: 'There are no volunteer emails matching current filters.',
        variant: 'destructive',
      })
      return
    }
    navigator.clipboard.writeText(emails)
    toast({
      title: 'Copied volunteer emails',
      description: `Copied ${filtered.length} email address(es) formatted for bulk pasting.`,
    })
  }

  const handleEmailAllBCC = () => {
    const emails = filtered.map((v) => v.email).filter(Boolean).join(',')
    if (!emails) return
    window.open(`mailto:?bcc=${encodeURIComponent(emails)}&subject=${encodeURIComponent('Update from Script Worldview Foundation')}`, '_blank')
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Status', 'Applied At']
    const rows = filtered.map((v) => [
      `"${v.name.replace(/"/g, '""')}"`,
      `"${v.email}"`,
      `"${v.phone || ''}"`,
      `"${v.location || ''}"`,
      v.status,
      `"${new Date(v.appliedAt).toLocaleString()}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'volunteers_list.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this volunteer record?')) return
    try {
      const res = await fetch(`/api/admin/volunteers/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete volunteer')
      toast({ title: 'Deleted', description: 'Volunteer record removed.' })
      setVolunteers((prev) => prev.filter((v) => v.id !== id))
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  }

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAdding(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || null,
      location: (formData.get('location') as string) || null,
      status: formData.get('status') as string,
    }

    try {
      const res = await fetch('/api/admin/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add volunteer')
      const data = await res.json()
      toast({ title: 'Added Volunteer', description: `${payload.name} onboarded successfully.` })
      setVolunteers((prev) => [data.data, ...prev])
      setShowAddModal(false)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            Volunteers Mobilization CRM
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Roster: <span className="font-medium text-gray-900 dark:text-white">{volunteers.length}</span> volunteers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAllEmails}
            title="Copy all filtered volunteer emails"
            className="text-xs"
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy All Emails
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleEmailAllBCC}
            title="Email all filtered volunteers via default client"
            className="text-xs"
          >
            <Mail className="mr-1.5 h-3.5 w-3.5" />
            Email All (BCC)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by volunteer name, email, phone, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          />
        </div>

        <select
          aria-label="Filter by volunteer status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table Content */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="font-medium text-gray-900 dark:text-white">No volunteer records found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-xs font-semibold uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                  <th className="px-5 py-3">Volunteer</th>
                  <th className="px-5 py-3">1-Click Contacts</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Applied Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-800">
                {filtered.map((vol) => (
                  <tr key={vol.id} className="hover:bg-gray-50/50 transition-colors dark:hover:bg-gray-800/30">
                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                      <Link href={`/admin/volunteers/${vol.id}`} className="hover:underline">
                        {vol.name}
                      </Link>
                    </td>

                    {/* 1-Click Communication Suite */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${vol.email}`}
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline dark:text-emerald-400 font-medium"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {vol.email}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyText(vol.email, `${vol.id}-email`, 'Email')}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Copy email address"
                          >
                            {copiedId === `${vol.id}-email` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>

                        {vol.phone && (
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${vol.phone}`}
                              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                              <Phone className="h-3 w-3 text-gray-400" />
                              {vol.phone}
                            </a>
                            <a
                              href={`https://wa.me/${vol.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                              title="Chat on WhatsApp"
                              aria-label="Chat on WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyText(vol.phone!, `${vol.id}-phone`, 'Phone')}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title="Copy phone number"
                            >
                              {copiedId === `${vol.id}-phone` ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300 text-xs">
                      {vol.location || '—'}
                    </td>

                    <td className="px-5 py-4">
                      <VolunteerStatusActions id={vol.id} currentStatus={vol.status} />
                    </td>

                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(vol.appliedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        onClick={() => handleDelete(vol.id)}
                        title="Remove volunteer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Volunteer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Manually Onboard Volunteer</h4>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <Label htmlFor="location">City / Location</Label>
                  <Input id="location" name="location" placeholder="Jos, Nigeria" />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Onboarding Status</Label>
                <select
                  id="status"
                  name="status"
                  aria-label="Onboarding Status"
                  defaultValue="approved"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="active">Active</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={adding} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {adding ? 'Onboarding...' : 'Save Volunteer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
