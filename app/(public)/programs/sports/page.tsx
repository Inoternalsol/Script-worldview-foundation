import { PageHero } from '@/components/public/shared/PageHero'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Activity, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export default function SportsProgramPage() {
  return (
    <div>
      <PageHero
        title="Sports & Athletics"
        subtitle="Empowering youth through teamwork, discipline, and physical excellence with a focus on Basketball."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-semibold text-brand-primary">
                <Activity className="mr-2 h-4 w-4" /> Youth Empowerment
              </div>
              <h2 className="mb-6 font-heading text-3xl font-bold text-foreground">
                Beyond the Court: Building Tomorrow's Leaders
              </h2>
              <p className="mb-6 text-lg text-brand-muted">
                Our sports program uses basketball as a vehicle for social change. We provide a safe space for youth to develop not only their athletic skills but also their character, leadership, and community responsibility.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-secondary shrink-0" />
                  <span className="text-brand-muted"><strong>Basketball Camps:</strong> Seasonal clinics focusing on fundamentals, strategy, and sportsmanship.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-secondary shrink-0" />
                  <span className="text-brand-muted"><strong>Youth Leagues:</strong> Competitive local leagues to foster teamwork and healthy competition.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-secondary shrink-0" />
                  <span className="text-brand-muted"><strong>Mentorship:</strong> Connecting young athletes with professional mentors and coaches.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-secondary shrink-0" />
                  <span className="text-brand-muted"><strong>Facilities Development:</strong> Building and renovating basketball courts in underserved neighborhoods.</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
              <Image 
                src="/images/programs/sports.png" 
                alt="Youth playing basketball" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-brand-primary/5 py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-6 font-heading text-3xl font-bold text-brand-primary md:text-4xl">
            Support Our Athletes
          </h2>
          <p className="mb-8 text-brand-muted">
            Help us provide gear, coaching, and better facilities for the next generation of Plateau State basketball stars.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild variant="cta" size="lg">
              <Link href="/donate?campaign=sports">Donate to Sports Fund</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
