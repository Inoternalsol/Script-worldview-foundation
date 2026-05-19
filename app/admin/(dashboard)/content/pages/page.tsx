'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Edit, Eye, Globe } from 'lucide-react'

const mockPages = [
  { id: '1', title: 'Home Page', slug: '/', status: 'published', lastUpdated: '2026-05-19 12:30' },
  { id: '2', title: 'About Us', slug: '/about', status: 'published', lastUpdated: '2026-05-18 10:14' },
  { id: '3', title: 'Emergency Flood Interventions', slug: '/programs/humanitarian', status: 'published', lastUpdated: '2026-05-15 09:40' },
  { id: '4', title: 'Youth Empowerment Initiative', slug: '/programs/capacity', status: 'draft', lastUpdated: '2026-05-19 16:22' },
]

export default function AdminPagesContentManager() {
  const [pages, setPages] = useState(mockPages)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Content Pages Manager</h1>
          <p className="mt-1 text-sm text-brand-muted">Edit static page copies, metadata configurations, and social share assets.</p>
        </div>
        <Button variant="cta" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Custom Page
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-brand-muted border-b border-black/5">
                <tr>
                  <th className="px-6 py-4">Page Title</th>
                  <th className="px-6 py-4">Route Path</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50/50">
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
                    <td className="px-6 py-4 text-brand-muted text-xs">{page.lastUpdated}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="secondary" size="sm" className="inline-flex items-center gap-1">
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
