'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

type Program = {
  id: string
  name: string
  slug: string
  category: string
  description: string
  icon: string | null
  featuredImage: string | null
  status: string
  sortOrder: number
}

export default function EditProgramPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [program, setProgram] = useState<Program | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProgram() {
      try {
        const res = await fetch(`/api/admin/programs/${id}`)
        if (!res.ok) throw new Error('Failed to load program')
        const data = await res.json()
        setProgram(data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProgram()
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const body = {
      name: form.get('name') as string,
      slug: form.get('slug') as string,
      category: form.get('category') as string,
      description: form.get('description') as string,
      icon: (form.get('icon') as string) || null,
      featuredImage: (form.get('featuredImage') as string) || null,
      status: form.get('status') as string,
      sortOrder: parseInt(form.get('sortOrder') as string || '0', 10),
    }

    try {
      const res = await fetch(`/api/admin/programs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || data.error || 'Failed to update program')
      }

      router.push('/admin/programs')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this program? This action cannot be undone.')) return
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/programs/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || data.error || 'Failed to delete program')
      }

      router.push('/admin/programs')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-brand-muted">Loading program data...</div>
  if (!program && error) return <div className="p-6 text-center text-red-600">Error: {error}</div>
  if (!program) return <div className="p-6 text-center text-brand-muted">Program not found.</div>

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/programs"
        className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Edit Program</h1>
          <p className="mt-1 text-sm text-brand-muted">Modify the details of your program pillar.</p>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={deleting || saving}>
          <Trash2 className="mr-2 h-4 w-4" /> {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" defaultValue={program.name} required placeholder="Program name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" defaultValue={program.slug} required placeholder="program-slug" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              name="category"
              title="Category"
              defaultValue={program.category}
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
            <Input id="icon" name="icon" defaultValue={program.icon || ''} placeholder="BookOpen, Heart, Shield, Users, etc." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input id="featuredImage" name="featuredImage" type="url" defaultValue={program.featuredImage || ''} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              title="Status"
              defaultValue={program.status}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={program.sortOrder} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" defaultValue={program.description} rows={8} required placeholder="Program description..." />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" variant="cta" disabled={saving || deleting}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
