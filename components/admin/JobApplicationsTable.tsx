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
  Briefcase,
  Plus,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Trash2,
  Search,
  Loader2,
  FileText,
  Eye,
  Linkedin,
} from 'lucide-react'

type JobApplication = {
  id: string
  jobId: string
  name: string
  email: string
  phone: string | null
  yearsExperience: number | null
  cvUrl: string | null
  coverLetter: string | null
  linkedinUrl: string | null
  status: 'received' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  appliedAt?: string | number
}

const STATUS_COLORS: Record<string, string> = {
  received: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  reviewing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  shortlisted: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  hired: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function JobApplicationsTable({
  jobId,
  jobTitle,
}: {
  jobId: string
  jobTitle: string
}) {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [adding, setAdding] = useState(false)
  const [selectedAppModal, setSelectedAppModal] = useState<JobApplication | null>(null)

  const loadApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/careers/${jobId}/applications`)
      if (!res.ok) {
        throw new Error('Could not fetch applications')
      }
      const data = await res.json()
      setApplications(Array.isArray(data.data) ? data.data : [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [jobId])

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        app.name.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        (app.phone && app.phone.toLowerCase().includes(query)) ||
        (app.coverLetter && app.coverLetter.toLowerCase().includes(query))

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [applications, searchQuery, statusFilter])

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
    const emails = filteredApplications.map((a) => a.email).filter(Boolean).join(', ')
    if (!emails) {
      toast({
        title: 'No emails found',
        description: 'There are no applicant emails matching current filters.',
        variant: 'destructive',
      })
      return
    }
    navigator.clipboard.writeText(emails)
    toast({
      title: 'Copied applicant emails',
      description: `Copied ${filteredApplications.length} email address(es) formatted for bulk pasting.`,
    })
  }

  const handleEmailAllBCC = () => {
    const emails = filteredApplications.map((a) => a.email).filter(Boolean).join(',')
    if (!emails) return
    window.open(`mailto:?bcc=${encodeURIComponent(emails)}&subject=${encodeURIComponent(`Update regarding ${jobTitle}`)}`, '_blank')
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Years Experience', 'CV URL', 'LinkedIn URL', 'Status', 'Applied At']
    const rows = filteredApplications.map((a) => [
      `"${a.name.replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.phone || ''}"`,
      `"${a.yearsExperience || ''}"`,
      `"${a.cvUrl || ''}"`,
      `"${a.linkedinUrl || ''}"`,
      a.status,
      `"${a.appliedAt ? new Date(a.appliedAt).toLocaleString() : ''}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${jobTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_applicants.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/careers/${jobId}/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      toast({ title: 'Status updated', description: `Candidate moved to ${newStatus}.` })
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: newStatus as any } : a)))
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  }

  const handleDelete = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) return
    try {
      const res = await fetch(`/api/admin/careers/${jobId}/applications/${appId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete applicant')
      toast({ title: 'Deleted', description: 'Application record removed.' })
      setApplications((prev) => prev.filter((a) => a.id !== appId))
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
      yearsExperience: formData.get('yearsExperience') ? Number(formData.get('yearsExperience')) : null,
      cvUrl: (formData.get('cvUrl') as string) || null,
      linkedinUrl: (formData.get('linkedinUrl') as string) || null,
      coverLetter: (formData.get('coverLetter') as string) || null,
      status: formData.get('status') as string,
    }

    try {
      const res = await fetch(`/api/admin/careers/${jobId}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add candidate')
      toast({ title: 'Added Candidate', description: `${payload.name} added to pipeline.` })
      setShowAddModal(false)
      loadApplications()
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
            <Users className="h-5 w-5 text-emerald-600" />
            Applicant Management CRM
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Candidates: <span className="font-medium text-gray-900 dark:text-white">{applications.length}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAllEmails}
            title="Copy all filtered applicant emails as a comma-separated list"
            className="text-xs"
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy All Emails
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleEmailAllBCC}
            title="Open default email client with all candidates in BCC"
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
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by candidate name, email, phone, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          />
        </div>

        <select
          aria-label="Filter by application status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        >
          <option value="all">All Pipeline Stages</option>
          <option value="received">Received</option>
          <option value="reviewing">Reviewing</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-sm">Loading applicant pipeline...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>Error: {error}</p>
            <Button variant="outline" size="sm" onClick={loadApplications} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Briefcase className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="font-medium text-gray-900 dark:text-white">No job applications found</p>
            <p className="text-sm text-gray-500 mt-1">
              {applications.length === 0
                ? 'No candidates have submitted applications for this role yet.'
                : 'Try adjusting your search filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-xs font-semibold uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-5 py-3">1-Click Contacts</th>
                  <th className="px-5 py-3">Profile & CV</th>
                  <th className="px-5 py-3">Stage / Status</th>
                  <th className="px-5 py-3">Applied Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-800">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50/50 transition-colors dark:hover:bg-gray-800/30"
                  >
                    {/* Candidate Identity */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{app.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {app.yearsExperience !== null ? `${app.yearsExperience} yrs experience` : 'Experience unspecified'}
                      </div>
                    </td>

                    {/* 1-Click Contacts Suite */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        {/* Email Row */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${app.email}`}
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline dark:text-emerald-400 font-medium"
                            title="Send email via default client"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            {app.email}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyText(app.email, `${app.id}-email`, 'Email')}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Copy email address"
                          >
                            {copiedId === `${app.id}-email` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>

                        {/* Phone / WhatsApp Row */}
                        {app.phone && (
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${app.phone}`}
                              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                              title="Call candidate"
                            >
                              <Phone className="h-3 w-3 text-gray-400" />
                              {app.phone}
                            </a>
                            <a
                              href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`}
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
                              onClick={() => handleCopyText(app.phone!, `${app.id}-phone`, 'Phone')}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title="Copy phone number"
                            >
                              {copiedId === `${app.id}-phone` ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Profile & CV links */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {app.cvUrl ? (
                          <a
                            href={app.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                          >
                            <FileText className="h-3 w-3 text-emerald-600" />
                            Resume/CV
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No CV link</span>
                        )}

                        {app.linkedinUrl && (
                          <a
                            href={app.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            <Linkedin className="h-3 w-3" />
                            LinkedIn
                          </a>
                        )}

                        {(app.coverLetter || app.yearsExperience !== null) && (
                          <button
                            type="button"
                            onClick={() => setSelectedAppModal(app)}
                            className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                          >
                            <Eye className="h-3 w-3 text-emerald-600" />
                            Inspect
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Stage Switcher */}
                    <td className="px-5 py-4">
                      <select
                        aria-label="Change candidate status"
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 cursor-pointer ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        <option value="received">Received</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Applied Date */}
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {app.appliedAt
                        ? new Date(app.appliedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        onClick={() => handleDelete(app.id)}
                        title="Delete application record"
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

      {/* Inspect Candidate Modal */}
      {selectedAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 dark:border-gray-800">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Candidate Details</h4>
              <button
                type="button"
                onClick={() => setSelectedAppModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Name: </span>
                <span className="text-gray-900 dark:text-white">{selectedAppModal.name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Email: </span>
                <span className="text-gray-900 dark:text-white">{selectedAppModal.email}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Experience: </span>
                <span className="text-gray-900 dark:text-white">{selectedAppModal.yearsExperience || 0} years</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Cover Letter / Pitch: </span>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-xs">
                  {selectedAppModal.coverLetter || 'No cover letter submitted.'}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedAppModal(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Manually Add Candidate</h4>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <Label htmlFor="name">Candidate Name *</Label>
                <Input id="name" name="name" required placeholder="Jane Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <Label htmlFor="yearsExperience">Experience (Years)</Label>
                  <Input id="yearsExperience" name="yearsExperience" type="number" placeholder="5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cvUrl">Resume / CV Link</Label>
                  <Input id="cvUrl" name="cvUrl" placeholder="https://..." />
                </div>
                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input id="linkedinUrl" name="linkedinUrl" placeholder="https://linkedin.com/..." />
                </div>
              </div>
              <div>
                <Label htmlFor="coverLetter">Notes / Cover Letter</Label>
                <Input id="coverLetter" name="coverLetter" placeholder="Referral notes or cover letter text" />
              </div>
              <div>
                <Label htmlFor="status">Initial Status</Label>
                <select
                  id="status"
                  name="status"
                  aria-label="Initial Status"
                  defaultValue="received"
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                >
                  <option value="received">Received</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={adding} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {adding ? 'Adding...' : 'Save Candidate'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
