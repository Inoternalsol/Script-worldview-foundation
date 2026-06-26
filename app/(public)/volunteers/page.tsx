import { PageHero } from '@/components/public/shared/PageHero'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import { Heart, Globe, GraduationCap } from 'lucide-react'

import { VolunteerForm } from '@/components/public/forms/VolunteerForm'

export default function VolunteersPage() {
  return (
    <div>
      <PageHero
        title="Volunteer With Us"
        subtitle="Give your time, skills, and energy to support communities in need. Join our network of changemakers."
      />

      <section className="bg-card py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-brand-primary" />
              <h3 className="mb-2 font-heading text-xl font-bold">Field Volunteers</h3>
              <p className="text-brand-muted">Deploy to communities during medical outreaches, educational drives, and emergency relief operations.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <GraduationCap className="mx-auto mb-4 h-12 w-12 text-brand-primary" />
              <h3 className="mb-2 font-heading text-xl font-bold">Skill-Based Volunteering</h3>
              <p className="text-brand-muted">Offer your professional skills (medical, legal, tech, writing, photography) to support our core operations.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
              <Globe className="mx-auto mb-4 h-12 w-12 text-brand-primary" />
              <h3 className="mb-2 font-heading text-xl font-bold">Remote Ambassadors</h3>
              <p className="text-brand-muted">Help us fundraise, advocate, and spread awareness about our mission from anywhere in the world.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-primary py-24 text-white">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeader
            title="Ready to make a difference?"
            description="We are always looking for passionate individuals. Fill out our volunteer application form to get started."
            light
            centered
          />
          <div className="mt-8 rounded-2xl bg-card p-8 text-left text-foreground">
            <h3 className="mb-4 font-heading text-xl font-bold text-brand-primary text-center">Volunteer Application</h3>
            <VolunteerForm />
          </div>
        </div>
      </section>
    </div>
  )
}
