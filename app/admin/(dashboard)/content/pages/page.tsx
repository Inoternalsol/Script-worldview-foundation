import { adminFetch } from '@/lib/admin-api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Edit, Eye } from 'lucide-react'
import Link from 'next/link'

type PageItem = {
  id: string
  title: string
  slug: string
  status: string
  updatedAt: string | number
}

async function getPages(): Promise<PageItem[]> {
  try {
    const res = await adminFetch('/pages')
    return res.data
  } catch {
    return []
  }
}

export default async function AdminPagesContentManager() {
  const pagesList = await getPages()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Content Pages Manager</h1>
          <p className="mt-1 text-sm text-brand-muted">Edit static page copies, metadata configurations, and social share assets.</p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/content/pages/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Custom Page
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs font-bold uppercase tracking-wider text-brand-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4">Page Title</th>
                  <th className="px-6 py-4">Route Path</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {pagesList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-brand-muted">
                      No custom pages found. Create your first page!
                    </td>
                  </tr>
                ) : (
                  pagesList.map((page) => (
                    <tr key={page.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-brand-primary" />
                        {page.title}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-brand-secondary">{page.slug}</td>
                      <td className="px-6 py-4">
                        <Badge variant={page.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                          {page.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-brand-muted text-xs">
                        {new Date(page.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button asChild variant="secondary" size="sm">
                          <Link href={`/admin/content/pages/${page.id}`} className="inline-flex items-center gap-1">
                            <Edit className="h-3 w-3" /> Edit
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <a href={page.slug} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                            <Eye className="h-3 w-3" /> View
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
