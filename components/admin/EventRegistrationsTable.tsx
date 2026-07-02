'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Users, Mail, Phone, Building2 } from 'lucide-react'

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
  createdAt: string | number
}

export function EventRegistrationsTable({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRegistrations() {
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
    loadRegistrations()
  }, [eventId])

  const exportCSV = () => {
    if (registrations.length === 0) return

    const headers = ['Name', 'Email', 'Phone', 'Organization', 'Role', 'Dietary Needs', 'Accessibility Needs', 'Registered At']
    const rows = registrations.map((r) => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.organization || '').replace(/"/g, '""')}"`,
      `"${(r.roleTitle || '').replace(/"/g, '""')}"`,
      `"${(r.dietaryNeeds || '').replace(/"/g, '""')}"`,
      `"${(r.accessibilityNeeds || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt || Date.now()).toLocaleString()}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-attendees.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Users className="h-5 w-5 text-brand-primary" />
            Registered Attendees
          </div>
          <p className="text-sm text-brand-muted">
            {loading ? 'Loading attendees...' : `${registrations.length} attendee${registrations.length !== 1 ? 's' : ''} registered for this event`}
          </p>
        </div>

        {registrations.length > 0 && (
          <Button variant="outline" size="sm" onClick={exportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4 text-brand-primary" /> Export Roster (CSV)
          </Button>
        )}
      </div>

      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="py-8 text-center text-sm text-brand-muted">Loading attendee roster...</div>
        ) : error ? (
          <div className="py-8 text-center text-sm text-red-600">Failed to load attendees: {error}</div>
        ) : registrations.length === 0 ? (
          <div className="py-8 text-center text-sm text-brand-muted">No attendees registered for this event yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-xs font-semibold uppercase tracking-wider text-brand-muted">
                <th className="px-4 py-3">Attendee</th>
                <th className="px-4 py-3">Contact Info</th>
                <th className="px-4 py-3">Organization / Role</th>
                <th className="px-4 py-3">Special Needs</th>
                <th className="px-4 py-3">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{reg.name}</td>
                  <td className="px-4 py-3 text-brand-muted space-y-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Mail className="h-3 w-3 text-brand-primary shrink-0" /> {reg.email}
                    </div>
                    {reg.phone && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Phone className="h-3 w-3 text-brand-primary shrink-0" /> {reg.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brand-muted">
                    {reg.organization || reg.roleTitle ? (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Building2 className="h-3 w-3 text-brand-primary shrink-0" />
                        <span>{[reg.organization, reg.roleTitle].filter(Boolean).join(' • ')}</span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-brand-muted">
                    {reg.dietaryNeeds && <div><span className="font-medium text-foreground">Diet:</span> {reg.dietaryNeeds}</div>}
                    {reg.accessibilityNeeds && <div><span className="font-medium text-foreground">Access:</span> {reg.accessibilityNeeds}</div>}
                    {!reg.dietaryNeeds && !reg.accessibilityNeeds && 'None'}
                  </td>
                  <td className="px-4 py-3 text-xs text-brand-muted whitespace-nowrap">
                    {new Date(reg.createdAt || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
