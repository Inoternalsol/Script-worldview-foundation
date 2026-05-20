'use client';

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
import { PartnershipForm } from '@/components/public/forms/PartnershipForm'

// Mock Data
const partners = [
  { name: 'UNICEF', type: 'International NGO', description: 'Collaborating on child education initiatives.' },
  { name: 'World Health Organization', type: 'International NGO', description: 'Supporting our medical outreach programs.' },
  { name: 'First Bank of Nigeria', type: 'Corporate', description: 'Financial inclusion and micro-grant support.' },
  { name: 'Federal Ministry of Education', type: 'Government', description: 'Curriculum development and school accreditation.' },
  { name: 'Tech4Dev', type: 'Local NGO', description: 'Digital skills training partner.' },
  { name: 'The Ford Foundation', type: 'Foundation', description: 'Core program funding.' }
]

export default function PartnersPage() {
  return (
    <div>
      <PageHero
        title="Our Partners & Funders"
        subtitle="We believe that systemic change requires collaboration. We are proud to work alongside these incredible organizations."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner, idx) => (
              <div key={idx} className="flex flex-col justify-between rounded-xl border border-black/10 p-6 shadow-sm transition-all hover:shadow-md">
                <div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-secondary">{partner.type}</div>
                  <h3 className="mb-2 font-heading text-xl font-bold text-brand-primary">{partner.name}</h3>
                  <p className="text-sm text-brand-muted">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-primary/5 py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeader
            title="Become a Partner"
            description="Are you an organization looking to make a sustainable impact in Nigeria? Let's discuss how we can work together."
          />
          <div className="mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="cta" size="lg">
                  Inquire About Partnership
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-brand-primary">Partnership Proposal</DialogTitle>
                  <DialogDescription>
                    Fill out this form to submit your partnership inquiry. Our management team will review your proposal.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <PartnershipForm />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  )
}

