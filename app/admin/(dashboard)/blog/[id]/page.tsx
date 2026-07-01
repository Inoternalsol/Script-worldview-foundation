'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { TipTapEditor } from '@/components/admin/content/TipTapEditor'
import { RevisionDrawerClient } from '@/components/admin/RevisionDrawerClient'

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  categoryId: string | null
  featuredImage: string | null
  status: string
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/admin/blog/${id}`)
        if (!res.ok) throw new Error('Failed to load post')
        const data = await res.json()
        setPost(data.data)
        setContent(data.data.content || '')
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const body = {
      title: form.get('title') as string,
      slug: form.get('slug') as string,
      content: content,
      excerpt: (form.get('excerpt') as string) || undefined,
      categoryId: (form.get('categoryId') as string) || undefined,
      featuredImage: (form.get('featuredImage') as string) || undefined,
      status: form.get('status') as string,
    }

    try {
      if (post) {
        await fetch('/api/admin/revisions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entityId: post.id,
            entityType: 'blog_post',
            title: post.title,
            snapshotJson: JSON.stringify({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt,
            }),
            reason: 'Auto-snapshot prior to manual edit',
          }),
        }).catch(() => {})
      }

      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update post')
      }

      router.push('/admin/blog')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-brand-muted">Loading post data...</div>
  if (!post && error) return <div className="p-6 text-center text-red-600">Error: {error}</div>
  if (!post) return <div className="p-6 text-center text-brand-muted">Post not found.</div>

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Edit Blog Post</h1>
          <p className="mt-1 text-sm text-brand-muted">Modify the details of your blog article.</p>
        </div>
        <RevisionDrawerClient
          entityId={id}
          entityType="blog_post"
          onRestored={() => window.location.reload()}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" defaultValue={post.title} required placeholder="Article title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" defaultValue={post.slug} required placeholder="article-slug" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              title="Category"
              defaultValue={post.categoryId || ''}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select category</option>
              <option value="news">News</option>
              <option value="stories">Impact Stories</option>
              <option value="reports">Reports</option>
              <option value="announcements">Announcements</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={post.excerpt || ''} rows={2} placeholder="Brief summary..." />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Content *</Label>
            <TipTapEditor value={content} onChange={setContent} placeholder="Write your article content here..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input id="featuredImage" name="featuredImage" defaultValue={post.featuredImage || ''} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              title="Status"
              defaultValue={post.status}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
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
