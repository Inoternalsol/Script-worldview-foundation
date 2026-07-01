import { PageHero } from '@/components/public/shared/PageHero'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import { Target, Eye, Heart, BookOpen, HeartHandshake, Users, FlaskConical, GraduationCap, Activity } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { getServerEnv } from '@/lib/env'

export default async function AboutPage() {
  const env = getServerEnv()
  let settings = null
  
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/settings/about_page`, {
      next: { revalidate: 60 }
    })
    if (res.ok) {
      const json = await res.json()
      settings = json.data
    }
  } catch (error) {
    console.error('Failed to fetch about page settings:', error)
  }

  const heroTitle = settings?.heroTitle || "Who We Are"
  const heroSubtitle = settings?.heroSubtitle || "We are a faith-inspired organization committed to shaping minds and transforming communities across Nigeria through education, humanitarian response, and sustainable development."
  const heroBgImage = settings?.heroBgImage || "/images/about-hero.png"
  const missionText = settings?.missionText || "To empower individuals and communities with the knowledge, resources, and support they need to build dignified and self-sustaining futures."
  const visionText = settings?.visionText || "A world where every community has the capacity to thrive, driven by educated minds and compassionate hearts."
  const valuesText = settings?.valuesText || "Faith-inspired service, absolute integrity, compassionate action, and a commitment to sustainable excellence."
  const quoteText = settings?.quoteText || '"Faith-inspired, values-driven. We believe that true transformation starts with a renewed worldview."'

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        backgroundImage={heroBgImage}
      />

      {/* Mission, Vision, Values */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <Target className="mx-auto mb-4 h-12 w-12 text-brand-secondary" />
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">Our Mission</h2>
              <p className="text-brand-muted">
                {missionText}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <Eye className="mx-auto mb-4 h-12 w-12 text-brand-secondary" />
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">Our Vision</h2>
              <p className="text-brand-muted">
                {visionText}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <Heart className="mx-auto mb-4 h-12 w-12 text-brand-secondary" />
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">Our Values</h2>
              <p className="text-brand-muted">
                {valuesText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Identity Statement */}
      <section className="bg-brand-primary py-24 text-center text-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-6 font-accent text-3xl italic leading-relaxed md:text-5xl">
            {quoteText}
          </h2>
          <Button variant="secondary" className="mt-8">
            Read Our Annual Report 2023
          </Button>
        </div>
      </section>

      {/* Story & Timeline */}
      <section className="bg-card py-20">
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
            description="Our work is organized into six key areas of intervention."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm">
              <BookOpen className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Education</h3>
                <p className="mt-1 text-sm text-brand-muted">Literacy, scholarships, and school infrastructure.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm">
              <HeartHandshake className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Humanitarian</h3>
                <p className="mt-1 text-sm text-brand-muted">Emergency relief, food security, and health interventions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm">
              <Users className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Community</h3>
                <p className="mt-1 text-sm text-brand-muted">Empowerment, peacebuilding, and local leadership.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm">
              <FlaskConical className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Research</h3>
                <p className="mt-1 text-sm text-brand-muted">Data-driven insights and policy advocacy.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm">
              <GraduationCap className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Capacity Building</h3>
                <p className="mt-1 text-sm text-brand-muted">Training and organizational development.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm">
              <Activity className="h-8 w-8 text-brand-primary shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-brand-primary">Sports & Athletics</h3>
                <p className="mt-1 text-sm text-brand-muted">Youth empowerment and leadership through basketball.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Overview */}
      <section className="bg-card py-20 text-center">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Leadership"
            title="Guided by Experience"
            description="Our board of trustees and executive team bring decades of experience in community development, faith-based leadership, and organizational governance."
          />
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl">
                <Image src="/images/team-founder.png" alt="Founder" fill className="object-cover" />
              </div>
              <h3 className="font-heading text-xl font-bold text-brand-primary">Rev. Joshua Sati</h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-brand-cta">Founder & Chairman</p>
              <p className="mt-4 text-sm text-brand-muted px-4">
                Visionary leader with over 15 years of experience in faith-inspired humanitarian work and rural community development across West Africa.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl">
                <Image src="/images/team-staff1.png" alt="Executive Director" fill className="object-cover" />
              </div>
              <h3 className="font-heading text-xl font-bold text-brand-primary">Sarah Nnamdi</h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-brand-cta">Executive Director</p>
              <p className="mt-4 text-sm text-brand-muted px-4">
                Spearheads operational strategy and partnerships, ensuring every initiative brings sustainable, measurable impact to communities.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl">
                <Image src="/images/team-staff2.png" alt="Operations Manager" fill className="object-cover" />
              </div>
              <h3 className="font-heading text-xl font-bold text-brand-primary">David Adeyemi</h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-brand-cta">Director of Programs</p>
              <p className="mt-4 text-sm text-brand-muted px-4">
                Oversees on-the-ground implementation of education and humanitarian projects, deeply connected with local community leaders.
              </p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/about/leadership">See Full Board of Trustees</Link>
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
