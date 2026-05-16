import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Briefcase, MapPin, Clock } from 'lucide-react'

// Mock Data
const mockJob = {
  id: '1',
  title: 'Program Manager (Education)',
  department: 'Programs',
  location: 'Jos, Plateau State',
  type: 'Full-time',
  deadline: 'Oct 30, 2024',
  description: `
    <p>We are seeking a highly motivated and experienced Program Manager to lead our Education initiatives. You will be responsible for overseeing the design, implementation, and evaluation of all education-focused projects, including scholarship disbursements, school infrastructure renovations, and teacher training programs.</p>
    <h3>Key Responsibilities</h3>
    <ul>
      <li>Manage the end-to-end lifecycle of the Education Program.</li>
      <li>Develop partnerships with local schools and education ministries.</li>
      <li>Monitor project budgets and ensure efficient resource allocation.</li>
      <li>Prepare comprehensive donor reports and impact assessments.</li>
      <li>Lead a team of 5 field officers and volunteers.</li>
    </ul>
    <h3>Requirements</h3>
    <ul>
      <li>Minimum of 5 years of experience in NGO program management.</li>
      <li>Bachelor's or Master's degree in Education, Development Studies, or a related field.</li>
      <li>Proven track record of managing grants and large-scale projects.</li>
      <li>Excellent communication and leadership skills.</li>
      <li>Willingness to travel frequently to rural communities.</li>
    </ul>
  `
}

export default function CareerPage({ params }: { params: { id: string } }) {
  // Mock fetching
  const job = params.id === mockJob.id ? mockJob : null

  if (!job) {
    notFound()
  }

  return (
    <article className="bg-background pb-20 pt-10">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        
        <Link href="/careers" className="mb-8 inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Careers
        </Link>

        <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-card md:p-12">
          <div className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-secondary">
            {job.department}
          </div>
          <h1 className="mb-6 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {job.title}
          </h1>
          
          <div className="mb-8 flex flex-wrap gap-6 border-b border-black/10 pb-8 text-sm text-brand-muted">
            <span className="flex items-center gap-1.5"><MapPin className="h-5 w-5 text-brand-primary" /> {job.location}</span>
            <span className="flex items-center gap-1.5"><Briefcase className="h-5 w-5 text-brand-primary" /> {job.type}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-5 w-5 text-brand-primary" /> Deadline: {job.deadline}</span>
          </div>

          <div 
            className="prose prose-lg max-w-none text-brand-muted prose-headings:font-heading prose-headings:text-brand-primary"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />

          <div className="mt-12 rounded-xl bg-gray-50 p-6 text-center border-2 border-dashed border-gray-200">
            <h3 className="mb-4 font-heading text-xl font-bold text-brand-primary">Apply for this Position</h3>
            <p className="mb-4 text-brand-muted">CareerApplicationForm component will be implemented here in Phase 4.</p>
          </div>
        </div>

      </div>
    </article>
  )
}
