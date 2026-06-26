'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Page = {
  id: string
  title: string
  slug: string
  contentJson: string
  metaTitle: string | null
  metaDesc: string | null
  ogImage: string | null
  status: string
}

export default function EditStaticPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState<Page | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/admin/pages/${id}`)
        if (!res.ok) throw new Error('Failed to load page data')
        const data = await res.json()
        setPage(data.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPage()
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    
    // Construct simple content JSON
    const content = form.get('content') as string
    const contentJson = JSON.stringify({ body: content })

    const body = {
      title: form.get('title') as string,
      slug: form.get('slug') as string,
      contentJson,
      metaTitle: (form.get('metaTitle') as string) || undefined,
      metaDesc: (form.get('metaDesc') as string) || undefined,
      ogImage: (form.get('ogImage') as string) || undefined,
      status: form.get('status') as string,
    }

    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update page')
      }

      router.push('/admin/content/pages')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-brand-muted">Loading page data...</div>
  if (!page && error) return <div className="p-6 text-center text-red-600">Error: {error}</div>
  if (!page) return <div className="p-6 text-center text-brand-muted">Page not found.</div>

  // Parse body from contentJson safely
  let contentBody = ''
  try {
    const parsed = JSON.parse(page.contentJson)
    contentBody = parsed.body || page.contentJson
  } catch {
    contentBody = page.contentJson
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/content/pages"
        className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Edit Page Content</h1>
        <p className="mt-1 text-sm text-brand-muted">Modify copywriting and SEO metadata settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Page Title *</Label>
            <Input id="title" name="title" defaultValue={page.title} required placeholder="e.g. Terms of Use" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (Path) *</Label>
            <Input id="slug" name="slug" defaultValue={page.slug} required placeholder="e.g. /terms" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              title="Status"
              defaultValue={page.status}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="content">Page Content (HTML/Text)</Label>
            <Textarea id="content" name="content" defaultValue={contentBody} rows={10} placeholder="Write page copy..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaTitle">SEO Meta Title</Label>
            <Input id="metaTitle" name="metaTitle" defaultValue={page.metaTitle || ''} placeholder="SEO Title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImage">SEO OpenGraph Image URL</Label>
            <Input id="ogImage" name="ogImage" defaultValue={page.ogImage || ''} placeholder="https://..." />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="metaDesc">SEO Meta Description</Label>
            <Textarea id="metaDesc" name="metaDesc" defaultValue={page.metaDesc || ''} rows={2} placeholder="Meta description..." />
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
    </div>
  )
}
