'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Settings, Save, ShieldAlert, Key, Globe } from 'lucide-react'

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [maintenance, setMaintenance] = useState(false)
  const [emailNotify, setEmailNotify] = useState(true)

  function handleSave() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: 'Settings Saved',
        description: 'Global system configuration updated successfully.',
      })
    }, 800)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Global Settings</h1>
        <p className="mt-1 text-sm text-brand-muted">Manage system variables, database connections, and API configurations.</p>
      </div>

      <div className="grid gap-6">
        {/* Organization Information */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b border-black/5 pb-4">
            <Globe className="h-5 w-5 text-brand-primary" />
            <div>
              <h2 className="font-heading text-lg font-semibold">Organization Info</h2>
              <p className="text-xs text-brand-muted">Public metadata and email dispatchers.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" defaultValue="Script Worldview Foundation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Global Contact Email</Label>
                <Input id="contactEmail" type="email" defaultValue="info@scriptworldviewfoundation.org" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Mission Tagline</Label>
              <Input id="tagline" defaultValue="Shaping Minds. Transforming Communities." />
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateways Config */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b border-black/5 pb-4">
            <Key className="h-5 w-5 text-brand-secondary" />
            <div>
              <h2 className="font-heading text-lg font-semibold">Payment Gateways</h2>
              <p className="text-xs text-brand-muted">Credentials for Stripe and Paystack connections.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paystackPublicKey">Paystack Public Key</Label>
                <Input id="paystackPublicKey" placeholder="pk_test_..." type="password" value="••••••••••••••••••••••••••••••••" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                <Input id="stripePublicKey" placeholder="pk_test_..." type="password" value="••••••••••••••••••••••••••••••••" readOnly />
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 border border-black/5">
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Webhook Endpoint URL</div>
              <div className="mt-1 font-mono text-xs text-brand-primary truncate">https://api.scriptworldviewfoundation.org/api/webhooks/...</div>
            </div>
          </CardContent>
        </Card>

        {/* Security & System Controls */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 border-b border-black/5 pb-4">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <div>
              <h2 className="font-heading text-lg font-semibold">System & Security</h2>
              <p className="text-xs text-brand-muted">Configure security thresholds and maintenance modes.</p>
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

            <div className="flex items-center justify-between border-t border-black/5 pt-4">
              <div className="space-y-0.5">
                <div className="text-sm font-semibold">Email Alerts on Form Submissions</div>
                <div className="text-xs text-brand-muted">Dispatch copies of all volunteer and career registrations immediately.</div>
              </div>
              <Switch checked={emailNotify} onCheckedChange={setEmailNotify} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary">Cancel</Button>
        <Button variant="cta" onClick={handleSave} disabled={loading} className="flex items-center gap-2">
          <Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
