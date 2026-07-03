'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  FileText,
  Edit,
  Eye,
  Globe,
  Home,
  Users,
  Phone,
  Target,
  HeartHandshake,
  Search,
  BookOpen,
  Calendar,
  Briefcase,
  Layers,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'

type PageItem = {
  id: string
  title: string
  slug: string
  status: string
  updatedAt: string | number
}

const CORE_PAGES = [
  {
    title: 'Home Page',
    slug: '/',
    editUrl: '/admin/content/home',
    description: 'Edit main hero titles, introductory copywriting, banner image, and core mission highlights.',
    icon: Home,
    category: 'core',
    badge: 'Landing Hub',
  },
  {
    title: 'About Us',
    slug: '/about',
    editUrl: '/admin/content/about',
    description: 'Edit organization history, mission, vision, core values, hero banner, and identity quotes.',
    icon: Users,
    category: 'core',
    badge: 'Institutional Core',
  },
  {
    title: 'Contact Desk',
    slug: '/contact',
    editUrl: '/admin/content/contact',
    description: 'Edit headquarters address, telephone numbers, contact email desk, and office operating hours.',
    icon: Phone,
    category: 'core',
    badge: 'Public Support',
  },
  {
    title: 'Programs & Interventions',
    slug: '/programs',
    editUrl: '/admin/content/programs-page',
    description: 'Edit primary programs hub headline, subtitle introduction, and banner imagery.',
    icon: Target,
    category: 'core',
    badge: 'Impact Hub',
  },
  {
    title: 'Get Involved',
    slug: '/get-involved',
    editUrl: '/admin/content/get-involved',
    description: 'Edit volunteer onboarding copy, donation call-to-actions, and partnership headers.',
    icon: HeartHandshake,
    category: 'core',
    badge: 'Engagement',
  },
]

const DYNAMIC_HUBS = [
  {
    title: 'Blog & Articles Hub',
    slug: '/blog',
    editUrl: '/admin/blog',
    description: 'Manage news posts, articles, press releases, and editorial categories.',
    icon: BookOpen,
    category: 'dynamic',
    badge: 'Editorial Feed',
  },
  {
    title: 'Events & Summits Hub',
    slug: '/events',
    editUrl: '/admin/events',
    description: 'Schedule upcoming conferences, workshops, community meetups, and attendee registrations.',
    icon: Calendar,
    category: 'dynamic',
    badge: 'Live Events',
  },
  {
    title: 'Careers & Opportunities',
    slug: '/careers',
    editUrl: '/admin/careers',
    description: 'Publish open job requisitions, fellowship positions, and review candidate applications.',
    icon: Briefcase,
    category: 'dynamic',
    badge: 'Recruitment',
  },
  {
    title: 'Impact Campaigns',
    slug: '/campaigns',
    editUrl: '/admin/campaigns',
    description: 'Launch fundraising initiatives, track donation targets, and highlight urgent relief efforts.',
    icon: Layers,
    category: 'dynamic',
    badge: 'Fundraising',
  },
]

function formatDate(val: string | number) {
  if (!val) return 'N/A'
  const d = new Date(val)
  if (isNaN(d.getTime())) return 'N/A'
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

export function PagesManagerClient({ pagesList }: { pagesList: PageItem[] }) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'dynamic' | 'custom'>('all')

  const filteredCore = CORE_PAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  const filteredDynamic = DYNAMIC_HUBS.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCustom = pagesList.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2.5">
            <Globe className="h-6 w-6 text-brand-primary" /> Website Content & CMS Manager
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Manage public copywriting, landing page imagery, dynamic feeds, and static policy pages in one centralized hub.
          </p>
        </div>
        <Button asChild variant="cta" className="shadow-sm font-bold">
          <Link href="/admin/content/pages/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Custom Page
          </Link>
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Content' },
            { id: 'core', label: 'Core Landing Pages' },
            { id: 'dynamic', label: 'Dynamic Feeds' },
            { id: 'custom', label: 'Custom & Policy Pages' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-muted/70 text-foreground/70 hover:bg-muted hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
          <Input
            placeholder="Search pages or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs bg-background"
          />
        </div>
      </div>

      {/* Core Pages Section */}
      {(activeTab === 'all' || activeTab === 'core') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">Core Landing Pages</h2>
              <p className="text-xs text-brand-muted">Primary static experiences displayed in main navigation and footers.</p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold text-brand-primary border-brand-primary/30 bg-brand-primary/5">
              Live Website Copy
            </Badge>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCore.map((page) => {
              const Icon = page.icon
              return (
                <Card key={page.slug} className="flex flex-col justify-between border border-border shadow-sm hover:border-brand-primary/40 transition-all bg-card">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded bg-brand-primary/10 px-2.5 py-1 text-[11px] font-bold text-brand-primary">
                        <Icon className="h-3.5 w-3.5" /> {page.badge}
                      </span>
                      <a
                        href={page.slug}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-muted hover:text-brand-primary inline-flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" /> Live ↗
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
                        <Edit className="h-3.5 w-3.5" /> Edit Copy & Images
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Dynamic Content Hubs */}
      {(activeTab === 'all' || activeTab === 'dynamic') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">Dynamic Feeds & Hubs</h2>
              <p className="text-xs text-brand-muted">Regularly updated feeds for news, events, jobs, and fundraising campaigns.</p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
              Structured Modules
            </Badge>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {filteredDynamic.map((hub) => {
              const Icon = hub.icon
              return (
                <Card key={hub.slug} className="flex flex-col justify-between border border-border shadow-sm hover:border-emerald-500/40 transition-all bg-card">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Icon className="h-3.5 w-3.5" /> {hub.badge}
                      </span>
                      <a
                        href={hub.slug}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`View ${hub.title} Live`}
                        aria-label={`View ${hub.title} Live`}
                        className="text-xs font-semibold text-brand-muted hover:text-emerald-600 inline-flex items-center gap-1"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <h3 className="font-heading font-bold text-base text-foreground leading-snug">
                      {hub.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <p className="text-xs text-brand-muted leading-relaxed min-h-[36px]">
                      {hub.description}
                    </p>
                    <Button asChild variant="outline" className="w-full justify-center gap-2 text-xs font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">
                      <Link href={hub.editUrl}>
                        Manage Entries
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Custom Static Pages List */}
      {(activeTab === 'all' || activeTab === 'custom') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">Custom Static & Policy Pages</h2>
              <p className="text-xs text-brand-muted">Standalone static pages like Terms of Service, Privacy Policy, or custom campaign briefs.</p>
            </div>
          </div>

          <Card className="border border-border shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-xs font-bold uppercase tracking-wider text-brand-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-4">Page Title</th>
                      <th className="px-6 py-4">Route Slug</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Last Updated</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredCustom.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-brand-muted text-xs">
                          No custom pages match your criteria. Click &quot;Create Custom Page&quot; to add one.
                        </td>
                      </tr>
                    ) : (
                      filteredCustom.map((page) => (
                        <tr key={page.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2.5">
                            <FileText className="h-4 w-4 text-brand-primary shrink-0" />
                            <span>{page.title}</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-brand-secondary">{page.slug}</td>
                          <td className="px-6 py-4">
                            <Badge variant={page.status === 'published' ? 'default' : 'secondary'} className="capitalize text-[11px]">
                              {page.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-brand-muted text-xs font-medium" suppressHydrationWarning>
                            {formatDate(page.updatedAt)}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Button asChild variant="secondary" size="sm" className="h-8 text-xs font-semibold">
                              <Link href={`/admin/content/pages/${page.id}`} className="inline-flex items-center gap-1">
                                <Edit className="h-3 w-3" /> Edit
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold">
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
      )}
    </div>
  )
}
