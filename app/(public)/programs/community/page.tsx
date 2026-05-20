'use client';

import { Handshake, ShieldCheck, Users } from 'lucide-react'
import Image from 'next/image'
import { PageHero } from '@/components/public/shared/PageHero'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CommunityProgramForm } from '@/components/public/forms/CommunityProgramForm'

export default function CommunityProgramPage() {
  return (
    <div>
      <PageHero
        title="Community Development"
        subtitle="Fostering sustainable socio-economic growth, peacebuilding, and local leadership."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-gray-50 p-8 text-center transition-all hover:-translate-y-1 hover:shadow-card">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                <Users className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="mb-4 font-heading text-xl font-bold text-brand-primary">Empowerment</h3>
              <p className="text-brand-muted">
                Providing micro-grants, vocational training, and cooperative support to women and youth, enabling them to start and sustain small businesses.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-gray-50 p-8 text-center transition-all hover:-translate-y-1 hover:shadow-card">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                <Handshake className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="mb-4 font-heading text-xl font-bold text-brand-primary">Peacebuilding</h3>
              <p className="text-brand-muted">
                Facilitating dialogue, conflict resolution training, and interfaith initiatives to foster social cohesion in divided communities.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-gray-50 p-8 text-center transition-all hover:-translate-y-1 hover:shadow-card">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                <ShieldCheck className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="mb-4 font-heading text-xl font-bold text-brand-primary">Advocacy</h3>
              <p className="text-brand-muted">
                Working with local leaders to advocate for better infrastructure, clean water access, and healthcare facilities at the grassroots level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Case Study"
            title="The Women's Cooperative Initiative"
            description="How 50 women transformed their local economy through collective savings and skill development."
          />
          <div className="mt-12 overflow-hidden rounded-2xl bg-white shadow-card md:flex">
            <div className="relative h-64 bg-gray-100 md:h-auto md:w-1/2">
              <Image 
                src="/images/programs/community.png" 
                alt="Community meeting" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-8 md:w-1/2 lg:p-12">
              <h3 className="mb-4 font-heading text-2xl font-bold text-brand-primary">Rebuilding Livelihoods</h3>
              <p className="mb-6 text-brand-muted">
                In 2022, we initiated a cooperative program in a rural farming community. By providing initial seed funding and training in modern agricultural processing, these women increased their household income by 300% within one year, allowing them to send their children back to school.
              </p>
              <blockquote className="border-l-4 border-brand-secondary pl-4 font-accent italic text-foreground">
                "Before the foundation came, we worked as individuals and struggled. Now, as a cooperative, we have a voice, we have savings, and we have hope."
                <footer className="mt-2 text-sm not-italic text-brand-muted">— Mrs. Aisha, Cooperative Leader</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Report a Community Need Section */}
      <section className="bg-brand-primary/5 py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeader
            title="Report a Community Need"
            description="Are you a grassroots leader or local community representative? Submit a request for program assessment."
          />
          <div className="mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="cta" size="lg">
                  Submit Outreach Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-brand-primary">Report Community Need</DialogTitle>
                  <DialogDescription>
                    Provide details about the local needs in your community. We review all submissions for field assessment.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 text-left">
                  <CommunityProgramForm />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  )
}

