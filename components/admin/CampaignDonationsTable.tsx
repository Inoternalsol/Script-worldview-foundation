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
  HeartHandshake,
  Plus,
  Copy,
  Check,
  MessageCircle,
  Search,
  Loader2,
  DollarSign,
} from 'lucide-react'

type Donation = {
  id: string
  campaignId: string
  donorName: string
  donorEmail: string
  amount: number
  currency: string
  paymentMethod: string
  reference: string | null
  message: string | null
  createdAt?: string | number
}

export function CampaignDonationsTable({
  campaignId,
  campaignTitle,
}: {
  campaignId: string
  campaignTitle: string
}) {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [adding, setAdding] = useState(false)

  const loadDonations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/donations`)
      if (!res.ok) throw new Error('Could not fetch campaign donations')
      const data = await res.json()
      setDonations(Array.isArray(data.data) ? data.data : [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDonations()
  }, [campaignId])

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const query = searchQuery.toLowerCase()
      return (
        !searchQuery ||
        d.donorName.toLowerCase().includes(query) ||
        d.donorEmail.toLowerCase().includes(query) ||
        (d.reference && d.reference.toLowerCase().includes(query)) ||
        (d.message && d.message.toLowerCase().includes(query))
      )
    })
  }, [donations, searchQuery])

  const totalRaisedFiltered = useMemo(() => {
    return filteredDonations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
  }, [filteredDonations])

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
    const emails = filteredDonations.map((d) => d.donorEmail).filter(Boolean).join(', ')
    if (!emails) {
      toast({
        title: 'No emails found',
        description: 'No donor email addresses match current filters.',
        variant: 'destructive',
      })
      return
    }
    navigator.clipboard.writeText(emails)
    toast({
      title: 'Copied donor emails',
      description: `Copied ${filteredDonations.length} email address(es).`,
    })
  }

  const handleEmailAllBCC = () => {
    const emails = filteredDonations.map((d) => d.donorEmail).filter(Boolean).join(',')
    if (!emails) return
    window.open(
      `mailto:?bcc=${encodeURIComponent(emails)}&subject=${encodeURIComponent(`Thank You from Script Worldview Foundation: ${campaignTitle}`)}`,
      '_blank'
    )
  }

  const handleSendThankYou = (email: string, name: string, amount: number) => {
    const subject = `Heartfelt Thanks for Supporting ${campaignTitle}!`
    const body = `Dear ${name},\n\nWe want to personally express our deepest gratitude for your generous donation of ₦${amount.toLocaleString()} to our campaign: "${campaignTitle}". Your support directly impacts our mission and community outreach.\n\nWarm regards,\nScript Worldview Foundation`
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
  }

  const handleExportCSV = () => {
    const headers = ['Donor Name', 'Donor Email', 'Amount', 'Currency', 'Payment Method', 'Reference', 'Message', 'Date']
    const rows = filteredDonations.map((d) => [
      `"${d.donorName.replace(/"/g, '""')}"`,
      `"${d.donorEmail}"`,
      d.amount,
      d.currency,
      d.paymentMethod,
      `"${d.reference || ''}"`,
      `"${(d.message || '').replace(/"/g, '""')}"`,
      `"${d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${campaignTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_donors.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAdding(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      donorName: formData.get('donorName') as string,
      donorEmail: formData.get('donorEmail') as string,
      amount: Number(formData.get('amount')),
      currency: formData.get('currency') as string,
      paymentMethod: formData.get('paymentMethod') as string,
      reference: (formData.get('reference') as string) || `OFFLINE-${Date.now()}`,
      message: (formData.get('message') as string) || null,
    }

    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to log donation')
      toast({ title: 'Donation Logged', description: `Added ₦${payload.amount.toLocaleString()} from ${payload.donorName}.` })
      setShowAddModal(false)
      loadDonations()
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
            <HeartHandshake className="h-5 w-5 text-emerald-600" />
            Donors & Contributions CRM
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Donors: <span className="font-medium text-gray-900 dark:text-white">{donations.length}</span> · Logged Total:{' '}
            <span className="font-bold text-emerald-600 dark:text-emerald-400">₦{totalRaisedFiltered.toLocaleString()}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAllEmails}
            title="Copy all donor emails"
            className="text-xs"
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy Emails
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleEmailAllBCC}
            title="Email all donors in BCC via default client"
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
            Log Offline Donation
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search donors by name, email, transaction reference, message..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        />
      </div>

      {/* Table Content */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
            <p className="text-sm">Loading donor contributions...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <p>Error: {error}</p>
            <Button variant="outline" size="sm" onClick={loadDonations} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <DollarSign className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="font-medium text-gray-900 dark:text-white">No donations found</p>
            <p className="text-sm text-gray-500 mt-1">
              {donations.length === 0 ? 'No online or offline contributions logged for this campaign yet.' : 'Adjust search filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-xs font-semibold uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                  <th className="px-5 py-3">Donor</th>
                  <th className="px-5 py-3">Contribution</th>
                  <th className="px-5 py-3">Payment Info</th>
                  <th className="px-5 py-3">Message / Note</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-800">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors dark:hover:bg-gray-800/30">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{d.donorName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`mailto:${d.donorEmail}`}
                          className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          {d.donorEmail}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyText(d.donorEmail, `${d.id}-email`, 'Email')}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {copiedId === `${d.id}-email` ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-gray-900 dark:text-white text-base">
                        {d.currency === 'NGN' || !d.currency ? '₦' : d.currency}{' '}
                        {Number(d.amount).toLocaleString()}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300 capitalize">
                        {d.paymentMethod}
                      </span>
                      {d.reference && (
                        <div className="text-gray-400 font-mono mt-1 text-[11px]">Ref: {d.reference}</div>
                      )}
                    </td>

                    <td className="px-5 py-4 max-w-xs text-xs text-gray-600 dark:text-gray-300 italic">
                      {d.message ? `"${d.message}"` : '—'}
                    </td>

                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendThankYou(d.donorEmail, d.donorName, Number(d.amount))}
                        className="text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/60 dark:hover:bg-emerald-950/40"
                      >
                        <Mail className="mr-1.5 h-3.5 w-3.5" />
                        Thank Donor
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Offline Donation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Log Offline / Bank Transfer Donation</h4>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-sm">
              <div>
                <Label htmlFor="donorName">Donor Name *</Label>
                <Input id="donorName" name="donorName" required placeholder="Anonymous or Full Name" />
              </div>
              <div>
                <Label htmlFor="donorEmail">Donor Email *</Label>
                <Input id="donorEmail" name="donorEmail" type="email" required placeholder="donor@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="amount">Amount (₦) *</Label>
                  <Input id="amount" name="amount" type="number" required placeholder="50000" />
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Channel</Label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    aria-label="Payment Channel"
                    defaultValue="bank_transfer"
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash / Cheque</option>
                    <option value="paystack">Online / Paystack</option>
                  </select>
                </div>
              </div>
              <input type="hidden" name="currency" value="NGN" />
              <div>
                <Label htmlFor="reference">Transaction Reference / Receipt #</Label>
                <Input id="reference" name="reference" placeholder="TRX-12345678" />
              </div>
              <div>
                <Label htmlFor="message">Donor Dedication or Note</Label>
                <Input id="message" name="message" placeholder="Keep up the great impact!" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={adding} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {adding ? 'Logging...' : 'Save Contribution'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
