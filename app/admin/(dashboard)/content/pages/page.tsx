import { adminFetch } from '@/lib/admin-api'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Edit, Eye, Globe, Home, Users, Phone, Target, HeartHandshake } from 'lucide-react'
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

const CORE_PAGES = [
  {
    title: 'Home Page',
    slug: '/',
    editUrl: '/admin/content/home',
    description: 'Edit main hero titles, subtitles, banner image, and core mission strip.',
    icon: Home,
    badge: 'Core Landing',
  },
  {
    title: 'About Us',
    slug: '/about',
    editUrl: '/admin/content/about',
    description: 'Edit organization history, mission, vision, values, hero banner, and identity quote.',
    icon: Users,
    badge: 'Institutional Core',
  },
  {
    title: 'Contact Us',
    slug: '/contact',
    editUrl: '/admin/content/contact',
    description: 'Edit headquarters address, telephone numbers, contact email, and working hours.',
    icon: Phone,
    badge: 'Public Desk',
  },
  {
    title: 'Programs & Interventions',
    slug: '/programs',
    editUrl: '/admin/content/programs-page',
    description: 'Edit primary programs hub headline, subtitle introduction, and banner imagery.',
    icon: Target,
    badge: 'Impact Hub',
  },
  {
    title: 'Get Involved',
    slug: '/get-involved',
    editUrl: '/admin/content/get-involved',
    description: 'Edit volunteer onboarding copy, donation call-to-actions, and partnership headers.',
    icon: HeartHandshake,
    badge: 'Engagement',
  },
]

export default async function AdminPagesContentManager() {
  const pagesList = await getPages()

  return (
    <div className="space-y-10 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2.5">
            <Globe className="h-6 w-6 text-brand-primary" /> Public Website Pages Manager
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Edit text copywriting, hero headlines, contact details, and banner images across all public pages.
          </p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/content/pages/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Custom Page
          </Link>
        </Button>
      </div>

      {/* Primary Website Pages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">Core Public Pages</h2>
            <p className="text-xs text-brand-muted">Primary pages displayed in top navigation and site footers.</p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold text-brand-primary border-brand-primary/30 bg-brand-primary/5">
            Live Website Copy
          </Badge>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CORE_PAGES.map((page) => {
            const Icon = page.icon
            return (
              <Card key={page.slug} className="flex flex-col justify-between border border-border shadow-sm hover:border-brand-primary/40 transition-all">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded bg-brand-primary/10 px-2.5 py-1 text-[11px] font-bold text-brand-primary">
                      <Icon className="h-3.5 w-3.5" /> {page.badge}
                    </span>
                    <a
                      href={page.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-brand-muted hover:text-brand-primary inline-flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" /> View Live
                    </a>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground leading-snug">
                    {page.title}
                  </h3>
                  <p className="font-mono text-xs text-brand-secondary mt-0.5">{page.slug}</p>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
                  <p className="text-xs text-brand-muted leading-relaxed min-h-[36px]">
                    {page.description}
                  </p>
                  <Button asChild variant="secondary" className="w-full justify-center gap-2 border border-border bg-muted/60 hover:bg-brand-primary hover:text-white transition-all text-xs font-bold">
                    <Link href={page.editUrl}>
                      <Edit className="h-3.5 w-3.5" /> Edit Content & Images
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Custom Static Pages List */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">Custom Static & Policy Pages</h2>
          <p className="text-xs text-brand-muted">Standalone pages like Terms of Service, Privacy Policy, or custom campaign drafts.</p>
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
                        No custom static pages found. Click &quot;Create Custom Page&quot; above to add one.
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
    </div>
  )
}
