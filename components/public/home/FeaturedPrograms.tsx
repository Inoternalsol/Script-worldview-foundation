import Link from 'next/link'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { ProgramCard } from '@/components/public/shared/ProgramCard'

// Mock Data - Will be replaced by API in Phase 5
const mockPrograms = [
  {
    id: '1',
    name: 'Education Scholarship Fund',
    slug: 'education-scholarship',
    description: 'Providing scholarships and educational materials to underprivileged children across local communities.',
    category: 'education' as const,
    icon: 'BookOpen'
  },
  {
    id: '2',
    name: 'Emergency Relief Operations',
    slug: 'emergency-relief',
    description: 'Delivering urgent food, medical supplies, and shelter to communities affected by sudden crises.',
    category: 'humanitarian' as const,
    icon: 'HeartHandshake'
  },
  {
    id: '3',
    name: 'Youth Leadership Program',
    slug: 'youth-leadership',
    description: 'Training the next generation of community leaders through mentorship and skills development.',
    category: 'capacity' as const,
    icon: 'Users'
  }
]

export function FeaturedPrograms() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHeader
          eyebrow="Our Work"
          title="Programs built for dignity and lasting impact"
          description="We partner with communities to deliver practical support today and long-term capacity for tomorrow."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {mockPrograms.map((program) => (
            <ProgramCard 
              key={program.id} 
              title={program.name}
              description={program.description}
              href={`/programs/${program.slug}`}
              category={program.category}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/programs" 
            className="inline-flex font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            View All Programs &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
