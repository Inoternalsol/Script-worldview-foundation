'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { adminClientFetch } from '@/lib/admin-client'

export default function NewProgramPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const nameVal = form.get('name') as string
    const body = {
      name: nameVal,
      slug: (form.get('slug') as string) || nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: form.get('category') as string,
      description: form.get('description') as string,
      icon: (form.get('icon') as string) || undefined,
      featuredImage: (form.get('featuredImage') as string) || undefined,
      status: (form.get('status') as string) || 'active',
      sortOrder: parseInt(form.get('sortOrder') as string || '0', 10),
    }

    try {
      await adminClientFetch('/programs', {
        method: 'POST',
        body: JSON.stringify(body),
      })

      router.push('/admin/programs')
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
        href="/admin/programs"
        className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">New Program</h1>
        <p className="mt-1 text-sm text-brand-muted">Add a new program pillar to the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required placeholder="Program name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="auto-generated-from-name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              name="category"
              title="Category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="education">Education & Training</option>
              <option value="humanitarian">Humanitarian Services</option>
              <option value="community">Community Development</option>
              <option value="research">Research & Publications</option>
              <option value="capacity">Capacity Building</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon Name (lucide-react name)</Label>
            <Input id="icon" name="icon" placeholder="BookOpen, Heart, Shield, Users, etc." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input id="featuredImage" name="featuredImage" type="url" placeholder="https://..." />
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
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue="0" />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" rows={8} required placeholder="Describe the program's vision, objectives, and local activities..." />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="cta" disabled={loading}>
            {loading ? 'Creating...' : 'Create Program'}
          </Button>
        </div>
      </form>
    </div>
  )
}
