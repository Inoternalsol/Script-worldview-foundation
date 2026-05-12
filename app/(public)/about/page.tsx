import { PageHero } from '@/components/public/shared/PageHero'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import { Target, Eye, Heart, BookOpen, HeartHandshake, Users, FlaskConical, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="Who We Are"
        subtitle="We are a faith-inspired organization committed to shaping minds and transforming communities across Nigeria through education, humanitarian response, and sustainable development."
      />

      {/* Mission, Vision, Values */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <Target className="mx-auto mb-4 h-12 w-12 text-brand-secondary" />
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">Our Mission</h2>
              <p className="text-brand-muted">
                To empower individuals and communities with the knowledge, resources, and support they need to build dignified and self-sustaining futures.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <Eye className="mx-auto mb-4 h-12 w-12 text-brand-secondary" />
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">Our Vision</h2>
              <p className="text-brand-muted">
                A world where every community has the capacity to thrive, driven by educated minds and compassionate hearts.
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm">
              <Heart className="mx-auto mb-4 h-12 w-12 text-brand-secondary" />
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">Our Values</h2>
              <p className="text-brand-muted">
                Faith-inspired service, absolute integrity, compassionate action, and a commitment to sustainable excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Identity Statement */}
      <section className="bg-brand-primary py-24 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-6 font-accent text-3xl italic leading-relaxed md:text-5xl">
            "Faith-inspired, values-driven. We believe that true transformation starts with a renewed worldview."
          </h2>
          <Button variant="secondary" className="mt-8">
            Read Our Annual Report 2023
          </Button>
        </div>
      </section>

      {/* Story & Timeline */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Our History"
            title="A Journey of Impact"
            description="From a small initiative to a nationwide foundation, our story is one of relentless commitment to communities."
          />
          <div className="mt-12 space-y-8 pl-4 md:pl-8 border-l-2 border-brand-secondary/30">
            <div className="relative">
              <div className="absolute -left-[21px] md:-left-[37px] h-4 w-4 rounded-full bg-brand-secondary" />
              <h3 className="font-heading text-xl font-bold text-brand-primary">2010 - The Beginning</h3>
              <p className="mt-2 text-brand-muted">Started as a small literacy program for out-of-school children in rural communities.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] md:-left-[37px] h-4 w-4 rounded-full bg-brand-secondary" />
              <h3 className="font-heading text-xl font-bold text-brand-primary">2015 - Expansion</h3>
              <p className="mt-2 text-brand-muted">Officially registered as an NGO and expanded into humanitarian response and community development.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] md:-left-[37px] h-4 w-4 rounded-full bg-brand-secondary" />
              <h3 className="font-heading text-xl font-bold text-brand-primary">2023 - Nationwide Reach</h3>
              <p className="mt-2 text-brand-muted">Reached over 2,000,000 lives impacted across 12 communities with 5 active programs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeader
            eyebrow="What We Do"
            title="Our Departments"
            description="Our work is organized into five key areas of intervention."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm">
              <BookOpen className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Education</h3>
                <p className="mt-1 text-sm text-brand-muted">Literacy, scholarships, and school infrastructure.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm">
              <HeartHandshake className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Humanitarian</h3>
                <p className="mt-1 text-sm text-brand-muted">Emergency relief, food security, and health interventions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm">
              <Users className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Community</h3>
                <p className="mt-1 text-sm text-brand-muted">Empowerment, peacebuilding, and local leadership.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm">
              <FlaskConical className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Research</h3>
                <p className="mt-1 text-sm text-brand-muted">Data-driven insights and policy advocacy.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm">
              <GraduationCap className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Capacity Building</h3>
                <p className="mt-1 text-sm text-brand-muted">Training and organizational development.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Overview */}
      <section className="bg-white py-20 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <SectionHeader
            eyebrow="Leadership"
            title="Guided by Experience"
            description="Our board of trustees brings decades of experience in community development, faith-based leadership, and corporate governance."
          />
          <div className="mt-12 flex justify-center">
            <Button asChild variant="cta" size="lg">
              <Link href="/about/leadership">See Full Leadership Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-primary/5 py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-6 font-heading text-3xl font-bold text-brand-primary md:text-4xl">
            Be Part of the Transformation
          </h2>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild variant="cta">
              <Link href="/volunteers">Join Us</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/get-involved">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
