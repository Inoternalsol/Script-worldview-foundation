import { PageHero } from '@/components/public/shared/PageHero'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export const revalidate = 3600; // Cache and statically regenerate page at most once per hour

export default function EducationProgramPage() {
  return (
    <div>
      <PageHero
        title="Education & Training"
        subtitle="Empowering the next generation through literacy, scholarships, and infrastructure development."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-semibold text-brand-primary">
                <BookOpen className="mr-2 h-4 w-4" /> Core Program
              </div>
              <h2 className="mb-6 font-heading text-3xl font-bold text-foreground">
                Building the Foundation for a Better Future
              </h2>
              <p className="mb-6 text-lg text-brand-muted">
                We believe that education is the most powerful tool to break the cycle of poverty. Our education initiatives are designed to ensure that every child, regardless of their background, has access to quality learning.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-secondary shrink-0" />
                  <span className="text-brand-muted"><strong>Scholarship Fund:</strong> Financial support for primary, secondary, and tertiary students.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-secondary shrink-0" />
                  <span className="text-brand-muted"><strong>School Infrastructure:</strong> Renovating classrooms, providing desks, and building libraries.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-secondary shrink-0" />
                  <span className="text-brand-muted"><strong>Teacher Training:</strong> Equipping educators with modern pedagogical skills.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-brand-secondary shrink-0" />
                  <span className="text-brand-muted"><strong>Digital Literacy:</strong> Introducing computer science and coding to rural schools.</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
              <Image 
                src="/images/programs/education.png" 
                alt="Students in classroom" 
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
            Sponsor a Student Today
          </h2>
          <p className="mb-8 text-brand-muted">
            For just ₦50,000, you can cover a child's educational expenses for an entire academic year.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild variant="cta" size="lg">
              <Link href="/donate?campaign=education">Donate to Education Fund</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
