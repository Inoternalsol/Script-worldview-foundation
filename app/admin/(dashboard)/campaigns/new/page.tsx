'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const body = {
      title: form.get('title') as string,
      slug: (form.get('slug') as string) || (form.get('title') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      goalAmount: parseInt(form.get('goalAmount') as string),
      deadline: form.get('deadline') ? new Date(form.get('deadline') as string).getTime() : undefined,
      description: form.get('description') as string,
      featuredImage: (form.get('featuredImage') as string) || undefined,
      status: (form.get('status') as string) || 'active',
    }

    try {
      const res = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create campaign')
      }

      router.push('/admin/campaigns')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/campaigns"
        className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">New Campaign</h1>
        <p className="mt-1 text-sm text-brand-muted">Launch a new fundraising campaign.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Campaign Title *</Label>
            <Input id="title" name="title" required placeholder="Campaign title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="auto-generated-from-title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalAmount">Goal Amount (₦) *</Label>
            <Input id="goalAmount" name="goalAmount" type="number" required placeholder="e.g. 5000000" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              title="Status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input id="featuredImage" name="featuredImage" placeholder="https://..." />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description * (HTML)</Label>
            <Textarea id="description" name="description" rows={8} required placeholder="Full campaign story..." />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="cta" disabled={loading}>
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </div>
  )
}
