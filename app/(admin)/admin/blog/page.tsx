import { adminFetch } from '@/lib/admin-api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Eye } from 'lucide-react'

type BlogPost = {
  id: string
  title: string
  slug: string
  status: string
  categoryId: string | null
  viewCount: number
  publishedAt: string | number | null
  createdAt: string | number
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await adminFetch('/blog')
    return res.data
  } catch {
    return []
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-700'
    case 'draft':
      return 'bg-amber-100 text-amber-700'
    case 'archived':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function BlogAdminPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="mt-1 text-sm text-brand-muted">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-gray-50/50">
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Views</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Created</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-brand-muted">
                    No blog posts yet. Create your first post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-black/5 transition-colors hover:bg-gray-50/50">
                    <td className="max-w-[280px] truncate px-4 py-3 font-medium text-foreground">
                      {post.title}
                    </td>
                    <td className="px-4 py-3 capitalize text-brand-muted">{post.categoryId || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> {post.viewCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="text-sm font-medium text-brand-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
