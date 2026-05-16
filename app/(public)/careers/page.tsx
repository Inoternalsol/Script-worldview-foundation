import { PageHero } from '@/components/public/shared/PageHero'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Briefcase, MapPin, Clock } from 'lucide-react'

// Mock Data
const jobs = [
  {
    id: '1',
    title: 'Program Manager (Education)',
    department: 'Programs',
    location: 'Jos, Plateau State',
    type: 'Full-time',
    deadline: 'Oct 30, 2024'
  },
  {
    id: '2',
    title: 'Monitoring & Evaluation Officer',
    department: 'Research',
    location: 'Enugu, Nigeria (Hybrid)',
    type: 'Contract',
    deadline: 'Nov 15, 2024'
  }
]

export default function CareersPage() {
  return (
    <div>
      <PageHero
        title="Careers"
        subtitle="Build a meaningful career. Join our team of passionate professionals dedicated to social impact."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <h2 className="mb-8 font-heading text-3xl font-bold text-brand-primary">Open Positions</h2>
          
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:shadow-card sm:flex-row sm:items-center">
                <div className="mb-6 sm:mb-0">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-secondary">{job.department}</div>
                  <h3 className="font-heading text-xl font-bold text-foreground">{job.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-muted">
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Deadline: {job.deadline}</span>
                  </div>
                </div>
                <div>
                  <Button asChild variant="cta">
                    <Link href={`/careers/${job.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}

            {jobs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-brand-muted">
                There are currently no open positions. Please check back later.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
