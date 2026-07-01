import { adminFetch } from '@/lib/admin-api'
import {
  Users,
  Heart,
  MessageSquare,
  Mail,
  FileText,
  Calendar,
  Briefcase,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react'

type Stats = {
  volunteers: number
  pendingVolunteers: number
  donations: number
  donationTotal: number
  contacts: number
  newContacts: number
  subscribers: number
  blogPosts: number
  events: number
  jobs: number
  applications: number
}

async function getStats(): Promise<Stats | null> {
  try {
    const res = await adminFetch('/stats')
    return res.data
  } catch {
    return null
  }
}

function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  color = 'text-brand-primary',
}: {
  label: string
  value: string | number
  subValue?: string
  icon: any
  color?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-brand-muted">{label}</div>
          <div className="mt-1 font-heading text-2xl font-bold text-foreground">{value}</div>
          {subValue && <div className="mt-1 text-xs text-brand-muted">{subValue}</div>}
        </div>
        <div className={`rounded-lg bg-brand-primary/5 p-2.5 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Overview of your organization&apos;s platform activity.
        </p>
      </div>

      {!stats ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-amber-500" />
          <p className="font-medium text-amber-800">Unable to connect to the API</p>
          <p className="mt-1 text-sm text-amber-600">
            Make sure the Cloudflare Worker is deployed and the API URL is configured.
          </p>
        </div>
      ) : (
        <>
          {/* Engagement Section */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-muted/60">
              Community Engagement
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Volunteer Applications"
                value={stats.volunteers}
                subValue={`${stats.pendingVolunteers} pending review`}
                icon={Users}
              />
              <StatCard
                label="Total Donations"
                value={stats.donations}
                subValue={`₦${(stats.donationTotal / 100).toLocaleString('en-US')} raised`}
                icon={Heart}
                color="text-green-600"
              />
              <StatCard
                label="Contact Messages"
                value={stats.contacts}
                subValue={`${stats.newContacts} unread`}
                icon={MessageSquare}
                color="text-blue-600"
              />
              <StatCard
                label="Newsletter Subscribers"
                value={stats.subscribers}
                icon={Mail}
                color="text-purple-600"
              />
            </div>
          </div>

          {/* Content Section */}
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-muted/60">
              Content
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                label="Blog Posts"
                value={stats.blogPosts}
                icon={FileText}
              />
              <StatCard
                label="Events"
                value={stats.events}
                icon={Calendar}
                color="text-orange-600"
              />
              <StatCard
                label="Job Postings"
                value={stats.jobs}
                subValue={`${stats.applications} applications`}
                icon={Briefcase}
                color="text-teal-600"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
