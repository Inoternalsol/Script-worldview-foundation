import { PageHero } from '@/components/public/shared/PageHero'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart, Handshake, Users, Megaphone } from 'lucide-react'

import { getServerEnv } from '@/lib/env'

export default async function GetInvolvedPage() {
  const env = getServerEnv()
  let settings = null

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/settings/get_involved_page`, {
      next: { revalidate: 60 }
    })
    if (res.ok) {
      const json = await res.json()
      settings = json.data
    }
  } catch (error) {
    console.error('Failed to fetch get involved page settings:', error)
  }

  const heroTitle = settings?.heroTitle || "Get Involved"
  const heroSubtitle = settings?.heroSubtitle || "There are many ways to support our mission. Find the path that fits your passion and skills."
  const donateTitle = settings?.donateTitle || "Donate"
  const donateDesc = settings?.donateDesc || "Your financial support directly funds our programs, from scholarships to emergency relief. Every amount makes a difference."
  const volunteerTitle = settings?.volunteerTitle || "Volunteer"
  const volunteerDesc = settings?.volunteerDesc || "Join our network of dedicated individuals who give their time, skills, and energy to support our on-ground interventions."
  const partnerTitle = settings?.partnerTitle || "Partner With Us"
  const partnerDesc = settings?.partnerDesc || "We actively seek collaborations with corporations, other NGOs, and government agencies to amplify our impact."

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-card">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                <Heart className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">{donateTitle}</h2>
              <p className="mb-8 text-brand-muted">
                {donateDesc}
              </p>
              <Button asChild variant="cta">
                <Link href="/donate">Make a Donation</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-card">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                <Users className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">{volunteerTitle}</h2>
              <p className="mb-8 text-brand-muted">
                {volunteerDesc}
              </p>
              <Button asChild variant="secondary">
                <Link href="/volunteers">Become a Volunteer</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-card">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                <Handshake className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">{partnerTitle}</h2>
              <p className="mb-8 text-brand-muted">
                {partnerDesc}
              </p>
              <Button asChild variant="secondary">
                <Link href="/partners">View Partnerships</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-card">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                <Megaphone className="h-8 w-8 text-brand-primary" />
              </div>
              <h2 className="mb-4 font-heading text-2xl font-bold text-brand-primary">Advocate</h2>
              <p className="mb-8 text-brand-muted">
                Use your voice to raise awareness about the challenges we tackle. Download our advocacy toolkit and share our mission.
              </p>
              <Button variant="secondary">
                Download Toolkit (PDF)
              </Button>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
