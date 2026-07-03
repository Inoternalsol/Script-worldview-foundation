'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, HeartHandshake, Layers } from 'lucide-react'
import Link from 'next/link'
import { CampaignDonationsTable } from '@/components/admin/CampaignDonationsTable'

type Campaign = {
  id: string
  title: string
  slug: string
  goalAmount: number
  raisedAmount: number
  deadline: string | number | null
  description: string
  featuredImage: string | null
  status: string
}

function formatDateLocal(epoch: string | number | null) {
  if (!epoch) return ''
  const d = new Date(epoch)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'donors'>('details')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#donors') {
      setActiveTab('donors')
    }

    async function fetchCampaign() {
      try {
        const res = await fetch(`/api/admin/campaigns/${id}`)
        if (!res.ok) throw new Error('Failed to load campaign')
        const data = await res.json()
        setCampaign(data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaign()
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const body = {
      title: form.get('title') as string,
      slug: form.get('slug') as string,
      goalAmount: parseInt(form.get('goalAmount') as string),
      deadline: form.get('deadline') ? new Date(form.get('deadline') as string).getTime() : undefined,
      description: form.get('description') as string,
      featuredImage: (form.get('featuredImage') as string) || undefined,
      status: form.get('status') as string,
    }

    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update campaign')
      }

      router.push('/admin/campaigns')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-brand-muted">Loading campaign...</div>
  if (!campaign && error) return <div className="p-6 text-center text-red-600">Error: {error}</div>
  if (!campaign) return <div className="p-6 text-center text-brand-muted">Campaign not found.</div>

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/admin/campaigns"
        className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{campaign.title}</h1>
          <p className="mt-1 text-sm text-brand-muted">Manage campaign goal details and financial contributors.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-lg bg-muted p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('details')
              window.history.pushState(null, '', window.location.pathname)
            }}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'details'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-brand-muted hover:text-foreground'
            }`}
          >
            <Layers className="h-4 w-4" />
            Campaign Details
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('donors')
              window.history.pushState(null, '', `#donors`)
            }}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === 'donors'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-brand-muted hover:text-foreground'
            }`}
          >
            <HeartHandshake className="h-4 w-4" />
            Donors Management
          </button>
        </div>
      </div>

      {activeTab === 'details' ? (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Campaign Title *</Label>
              <Input id="title" name="title" defaultValue={campaign.title} required placeholder="Campaign title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" name="slug" defaultValue={campaign.slug} required placeholder="campaign-slug" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goalAmount">Goal Amount (₦) *</Label>
              <Input id="goalAmount" name="goalAmount" type="number" defaultValue={campaign.goalAmount} required placeholder="e.g. 5000000" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" type="date" defaultValue={formatDateLocal(campaign.deadline)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                title="Status"
                defaultValue={campaign.status}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input id="featuredImage" name="featuredImage" defaultValue={campaign.featuredImage || ''} placeholder="https://..." />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description * (HTML)</Label>
              <Textarea id="description" name="description" defaultValue={campaign.description} rows={8} required placeholder="Full campaign story..." />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" variant="cta" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      ) : (
        <CampaignDonationsTable campaignId={campaign.id} campaignTitle={campaign.title} />
      )}
    </div>
  )
}
