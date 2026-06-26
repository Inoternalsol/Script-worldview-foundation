import { PageHero } from '@/components/public/shared/PageHero'
import { ProgramCard } from '@/components/public/shared/ProgramCard'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { apiFetch } from '@/lib/api/client'

export const revalidate = 86400; // Cache and statically regenerate page at most once per day

// Fallback Mock Data
const fallbackPrograms = [
  {
    id: '1',
    name: 'Education & Training',
    slug: 'education',
    description: 'Providing scholarships, literacy programs, and educational infrastructure to underserved communities.',
    category: 'education' as const,
    icon: 'BookOpen'
  },
  {
    id: '2',
    name: 'Humanitarian Response',
    slug: 'humanitarian',
    description: 'Delivering urgent relief, food security, and medical assistance to communities facing crises.',
    category: 'humanitarian' as const,
    icon: 'HeartHandshake'
  },
  {
    id: '3',
    name: 'Community Development',
    slug: 'community',
    description: 'Empowering local leadership, promoting peacebuilding, and fostering sustainable socio-economic growth.',
    category: 'community' as const,
    icon: 'Users'
  },
  {
    id: '4',
    name: 'Research & Publications',
    slug: 'research',
    description: 'Generating data-driven insights and policy advocacy to drive systemic change.',
    category: 'research' as const,
    icon: 'FlaskConical'
  },
  {
    id: '5',
    name: 'Capacity Building',
    slug: 'capacity',
    description: 'Training workshops and organizational development for community leaders and partner NGOs.',
    category: 'capacity' as const,
    icon: 'GraduationCap'
  },
  {
    id: '6',
    name: 'Sports & Athletics',
    slug: 'sports',
    description: 'Empowering youth through athletics, teamwork, and basketball development.',
    category: 'sports' as const,
    icon: 'Activity'
  }
]

export default async function ProgramsPage() {
  let list = fallbackPrograms

  try {
    const res = await apiFetch<any>('/api/programs')
    if (res.ok && res.data && Array.isArray(res.data) && res.data.length > 0) {
      list = res.data
    }
  } catch (error) {
    console.error('Failed to load programs list from API:', error)
  }

  return (
    <div>
      <PageHero
        title="Our Programs"
        subtitle="We deliver comprehensive interventions designed to address immediate needs while building long-term resilience and capacity."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {list.map((program) => (
              <ProgramCard 
                key={program.id} 
                title={program.name}
                description={program.description}
                href={`/programs/${program.slug}`}
                category={program.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-card py-20 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <SectionHeader
            title="Our Impact in Numbers"
            description="Across all our programs, we measure our success by the tangible difference we make in people's lives."
          />
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <div className="font-heading text-4xl font-bold text-brand-primary">15k+</div>
              <div className="mt-2 text-sm text-brand-muted">Students Supported</div>
            </div>
            <div>
              <div className="font-heading text-4xl font-bold text-brand-primary">50+</div>
              <div className="mt-2 text-sm text-brand-muted">Relief Missions</div>
            </div>
            <div>
              <div className="font-heading text-4xl font-bold text-brand-primary">120</div>
              <div className="mt-2 text-sm text-brand-muted">Communities Empowered</div>
            </div>
            <div>
              <div className="font-heading text-4xl font-bold text-brand-primary">5k+</div>
              <div className="mt-2 text-sm text-brand-muted">Leaders Trained</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-primary py-24 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl">Support Our Work</h2>
          <p className="mb-8 text-white/80">
            Your generous donation allows us to sustain and expand these vital programs across Nigeria.
          </p>
          <Button asChild variant="cta" size="lg">
            <Link href="/donate">Donate to a Program</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
