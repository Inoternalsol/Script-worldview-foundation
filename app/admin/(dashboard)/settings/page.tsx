'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Settings, Save, ShieldAlert, Key, Globe, Mail, Database, RefreshCw, CheckCircle2 } from 'lucide-react'

import { adminClientFetch } from '@/lib/admin-client'

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [runningBackup, setRunningBackup] = useState(false)

  // General Settings
  const [orgName, setOrgName] = useState('Script Worldview Foundation')
  const [contactEmail, setContactEmail] = useState('info@scriptworldviewfoundation.org')
  const [tagline, setTagline] = useState('Shaping Minds. Transforming Communities.')
  const [maintenance, setMaintenance] = useState(false)
  const [emailNotify, setEmailNotify] = useState(true)

  // Departmental Email Routing
  const [donationsEmail, setDonationsEmail] = useState('finance@scriptworldviewfoundation.org')
  const [volunteersEmail, setVolunteersEmail] = useState('volunteers@scriptworldviewfoundation.org')
  const [careersEmail, setCareersEmail] = useState('careers@scriptworldviewfoundation.org')

  // Backup status
  const [backupStatus, setBackupStatus] = useState<any>(null)

  async function loadSettings() {
    try {
      const s = await adminClientFetch('/settings')
      if (s) {
        setOrgName(s.orgName || 'Script Worldview Foundation')
        setContactEmail(s.contactEmail || 'info@scriptworldviewfoundation.org')
        setTagline(s.tagline || 'Shaping Minds. Transforming Communities.')
        setMaintenance(s.maintenanceMode || false)
        setEmailNotify(s.emailNotify !== undefined ? s.emailNotify : true)
        if (s.donationsEmail) setDonationsEmail(s.donationsEmail)
        if (s.volunteersEmail) setVolunteersEmail(s.volunteersEmail)
        if (s.careersEmail) setCareersEmail(s.careersEmail)
      }

      // Also fetch backup health status
      fetch('/api/admin/backups/status')
        .then((r) => r.json())
        .then((res) => {
          if (res.ok) setBackupStatus(res.data)
        })
        .catch(() => {})
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await adminClientFetch('/settings', {
        method: 'POST',
        body: JSON.stringify({
          orgName,
          contactEmail,
          tagline,
          maintenanceMode: maintenance,
          emailNotify,
          donationsEmail,
          volunteersEmail,
          careersEmail,
        }),
      })

      toast({
        title: 'Settings Saved',
        description: 'Global configuration and email routing updated successfully.',
      })
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleTriggerBackup() {
    setRunningBackup(true)
    try {
      const res = await fetch('/api/admin/backups/trigger', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Backup verification failed')

      toast({
        title: 'D1 Snapshot Verified',
        description: `Verified ${data.data?.totalRecordsVerified || 'all'} records across Cloudflare D1 nodes. Checksum recorded.`,
      })
      loadSettings()
    } catch (err: any) {
      toast({
        title: 'Backup Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setRunningBackup(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-brand-muted">Loading system configurations...</div>

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-brand-primary" /> System Settings & Governance Controls
        </h1>
        <p className="mt-1 text-sm text-brand-muted">Configure foundation profiles, department notification pipelines, and database integrity.</p>
      </div>

      <div className="grid gap-6">
        {/* General Profile Config */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b border-border pb-4">
            <Globe className="h-5 w-5 text-brand-primary" />
            <div>
              <h2 className="font-heading text-lg font-semibold">General Organization Profile</h2>
              <p className="text-xs text-brand-muted">Public organization branding and primary contact details.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Global Contact Email</Label>
                <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Mission Tagline</Label>
              <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Departmental Email Routing */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b border-border pb-4">
            <Mail className="h-5 w-5 text-brand-secondary" />
            <div>
              <h2 className="font-heading text-lg font-semibold">Departmental Alert Routing</h2>
              <p className="text-xs text-brand-muted">Direct form notifications to specific departmental email addresses.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="donationsEmail">Donations & Finance Desk</Label>
                <Input id="donationsEmail" type="email" value={donationsEmail} onChange={(e) => setDonationsEmail(e.target.value)} placeholder="finance@..." />
                <p className="text-[11px] text-brand-muted">Receives instant donation receipts and gateway alerts.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="volunteersEmail">Volunteer Coordinator Desk</Label>
                <Input id="volunteersEmail" type="email" value={volunteersEmail} onChange={(e) => setVolunteersEmail(e.target.value)} placeholder="volunteers@..." />
                <p className="text-[11px] text-brand-muted">Receives new volunteer and event onboarding pipelines.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="careersEmail">HR & Careers Desk</Label>
                <Input id="careersEmail" type="email" value={careersEmail} onChange={(e) => setCareersEmail(e.target.value)} placeholder="careers@..." />
                <p className="text-[11px] text-brand-muted">Receives job applications and candidate CV links.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Integrity & Automated Backups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-emerald-600" />
              <div>
                <h2 className="font-heading text-lg font-semibold">Cloudflare D1 Database & Survivability</h2>
                <p className="text-xs text-brand-muted">Automated edge snapshots and data integrity monitoring.</p>
              </div>
            </div>
            {backupStatus?.status === 'HEALTHY' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" /> Edge D1 Healthy
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/40 p-4 rounded-xl border border-border">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Donations Logged</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">{backupStatus?.recordCounts?.donations ?? '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Active Volunteers</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">{backupStatus?.recordCounts?.volunteers ?? '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Governance Docs</div>
                <div className="text-lg font-bold font-mono text-foreground mt-0.5">{backupStatus?.recordCounts?.transparencyDocs ?? '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Storage Engine</div>
                <div className="text-xs font-bold text-emerald-700 mt-1">Global D1 SQLite</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div>
                <div className="text-sm font-semibold text-foreground">Manual D1 Snapshot & Verification</div>
                <div className="text-xs text-brand-muted max-w-md">
                  Verify storage checksums and record an auditable recovery snapshot point across edge nodes.
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={runningBackup}
                onClick={handleTriggerBackup}
                className="flex items-center gap-2 border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${runningBackup ? 'animate-spin' : ''}`} />
                {runningBackup ? 'Verifying D1...' : 'Run Verification Snapshot'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security & System Controls */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b border-border pb-4">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <div>
              <h2 className="font-heading text-lg font-semibold">System & Security Controls</h2>
              <p className="text-xs text-brand-muted">Configure security thresholds and public website maintenance modes.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-semibold">Maintenance Mode</div>
                <div className="text-xs text-brand-muted">Lock down the public facing website with a temporary screen.</div>
              </div>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="space-y-0.5">
                <div className="text-sm font-semibold">Instant Form Notification Dispatch</div>
                <div className="text-xs text-brand-muted">Dispatch copies of form submissions to designated departmental desks immediately.</div>
              </div>
              <Switch checked={emailNotify} onCheckedChange={setEmailNotify} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={loadSettings}>Reset</Button>
        <Button variant="cta" onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  )
}
