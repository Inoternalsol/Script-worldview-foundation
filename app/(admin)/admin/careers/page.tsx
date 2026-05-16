import { adminFetch } from '@/lib/admin-api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

type Job = {
  id: string
  title: string
  department: string | null
  location: string | null
  type: string
  status: string
  deadline: string | number | null
  createdAt: string | number
}

async function getJobs(): Promise<Job[]> {
  try {
    const res = await adminFetch('/careers')
    return res.data
  } catch {
    return []
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-700'
    case 'closed':
      return 'bg-amber-100 text-amber-700'
    case 'archived':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function formatType(type: string) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default async function CareersAdminPage() {
  const jobs = await getJobs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Careers</h1>
          <p className="mt-1 text-sm text-brand-muted">
            {jobs.length} job posting{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/careers/new">
            <Plus className="mr-2 h-4 w-4" /> New Job
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-gray-50/50">
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Department</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Deadline</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-brand-muted">
                    No job postings yet. Create your first listing!
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b border-black/5 transition-colors hover:bg-gray-50/50">
                    <td className="max-w-[250px] truncate px-4 py-3 font-medium text-foreground">
                      {job.title}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{job.department || '—'}</td>
                    <td className="px-4 py-3 text-brand-muted">{formatType(job.type)}</td>
                    <td className="px-4 py-3 text-brand-muted">{job.location || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/careers/${job.id}`}
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
