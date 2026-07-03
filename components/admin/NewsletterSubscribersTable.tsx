'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import {
  Download,
  Mail,
  Plus,
  Copy,
  Check,
  Trash2,
  Search,
  Send,
  Newspaper,
} from 'lucide-react'

type Subscriber = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  status: string
  subscribedAt: string | number
}

export function NewsletterSubscribersTable({
  subscribers: initialSubscribers,
}: {
  subscribers: Subscriber[]
}) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [adding, setAdding] = useState(false)

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) => {
      const query = searchQuery.toLowerCase()
      const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        s.email.toLowerCase().includes(query) ||
        fullName.includes(query)

      const matchesStatus = statusFilter === 'all' || s.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [subscribers, searchQuery, statusFilter])

  const activeCount = useMemo(() => {
    return subscribers.filter((s) => s.status === 'active').length
  }, [subscribers])

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
    const emails = filteredSubscribers.map((s) => s.email).filter(Boolean).join(', ')
    if (!emails) {
      toast({
        title: 'No emails found',
        description: 'No subscriber email addresses match current filters.',
        variant: 'destructive',
      })
      return
    }
    navigator.clipboard.writeText(emails)
    toast({
      title: 'Copied subscriber mailing list',
      description: `Copied ${filteredSubscribers.length} email address(es) ready for newsletter broadcasting.`,
    })
  }

  const handleBroadcastBCC = () => {
    const emails = filteredSubscribers
      .filter((s) => s.status === 'active')
      .map((s) => s.email)
      .filter(Boolean)
      .join(',')
    if (!emails) {
      toast({
        title: 'No active subscribers',
        description: 'There are no active subscribers matching your filters.',
        variant: 'destructive',
      })
      return
    }
    window.open(
      `mailto:?bcc=${encodeURIComponent(emails)}&subject=${encodeURIComponent('Script Worldview Foundation Newsletter Update')}`,
      '_blank'
    )
  }

  const handleExportCSV = () => {
    const headers = ['Email', 'First Name', 'Last Name', 'Status', 'Subscribed At']
    const rows = filteredSubscribers.map((s) => [
      `"${s.email}"`,
      `"${s.firstName || ''}"`,
      `"${s.lastName || ''}"`,
      s.status,
      `"${new Date(s.subscribedAt).toLocaleString()}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'newsletter_subscribers.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'unsubscribed' : 'active'
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      toast({
        title: 'Status Updated',
        description: `Subscriber moved to ${nextStatus}.`,
      })
      setSubscribers((prev) => prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s)))
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this subscriber?')) return
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete subscriber')
      toast({ title: 'Deleted', description: 'Subscriber removed from mailing list.' })
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  }

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAdding(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      email: formData.get('email') as string,
      firstName: (formData.get('firstName') as string) || null,
      lastName: (formData.get('lastName') as string) || null,
    }

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add subscriber')
      const data = await res.json()
      toast({ title: 'Subscriber Added', description: `${payload.email} added to newsletter roster.` })
      setSubscribers((prev) => [data.data, ...prev])
      setShowAddModal(false)
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-emerald-600" />
            Audience & Newsletter CRM
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Audience: <span className="font-medium text-gray-900 dark:text-white">{subscribers.length}</span> · Active Recipients:{' '}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAllEmails}
            title="Copy all filtered email addresses formatted for mailing lists"
            className="text-xs"
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy Mailing List
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBroadcastBCC}
            title="Open default email client with all active filtered subscribers in BCC"
            className="text-xs"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Broadcast Newsletter (BCC)
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
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search subscribers by email address or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          />
        </div>

        <select
          aria-label="Filter by subscription status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          <option value="all">All Subscribers</option>
          <option value="active">Active Only</option>
          <option value="unsubscribed">Unsubscribed Only</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900">
        {filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Newspaper className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="font-medium text-gray-900 dark:text-white">No subscribers found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-xs font-semibold uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                  <th className="px-5 py-3">Subscriber Address</th>
                  <th className="px-5 py-3">Subscriber Name</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Subscribed Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-800">
                {filteredSubscribers.map((sub) => {
                  const fullName = [sub.firstName, sub.lastName].filter(Boolean).join(' ') || '—'
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors dark:hover:bg-gray-800/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${sub.email}`}
                            className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {sub.email}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyText(sub.email, `${sub.id}-email`, 'Email')}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Copy email address"
                          >
                            {copiedId === `${sub.id}-email` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                        {fullName}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(sub.id, sub.status)}
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                            sub.status === 'active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                          title={`Click to switch status to ${sub.status === 'active' ? 'unsubscribed' : 'active'}`}
                        >
                          {sub.status}
                        </button>
                      </td>

                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(sub.subscribedAt).toLocaleDateString(undefined, {
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
                          onClick={() => handleDelete(sub.id)}
                          title="Remove subscriber"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Manually Add Newsletter Subscriber</h4>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required placeholder="subscriber@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={adding} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {adding ? 'Adding...' : 'Add Subscriber'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
