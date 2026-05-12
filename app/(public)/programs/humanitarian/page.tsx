import { PageHero } from '@/components/public/shared/PageHero'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HeartHandshake, AlertCircle } from 'lucide-react'

export default function HumanitarianProgramPage() {
  return (
    <div>
      <PageHero
        title="Humanitarian Response"
        subtitle="Rapid, coordinated support for families facing urgent needs, displacement, and natural disasters."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 aspect-square rounded-2xl bg-gray-200">
              {/* Image Placeholder */}
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-sm font-semibold text-brand-primary">
                <HeartHandshake className="mr-2 h-4 w-4" /> Core Program
              </div>
              <h2 className="mb-6 font-heading text-3xl font-bold text-foreground">
                Compassion in Action During Crises
              </h2>
              <p className="mb-6 text-lg text-brand-muted">
                When crisis strikes, vulnerable communities are hit the hardest. Our humanitarian response team works rapidly to provide life-saving assistance, ensuring dignity and survival in the most challenging circumstances.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-black/5 bg-gray-50 p-4">
                  <h3 className="font-bold text-brand-primary">Food Security</h3>
                  <p className="mt-1 text-sm text-brand-muted">Distribution of emergency food rations and nutritional supplements.</p>
                </div>
                <div className="rounded-xl border border-black/5 bg-gray-50 p-4">
                  <h3 className="font-bold text-brand-primary">Medical Aid</h3>
                  <p className="mt-1 text-sm text-brand-muted">Mobile clinics, essential medicines, and psychosocial support.</p>
                </div>
                <div className="rounded-xl border border-black/5 bg-gray-50 p-4">
                  <h3 className="font-bold text-brand-primary">WASH</h3>
                  <p className="mt-1 text-sm text-brand-muted">Clean water provision, sanitation facilities, and hygiene kits.</p>
                </div>
                <div className="rounded-xl border border-black/5 bg-gray-50 p-4">
                  <h3 className="font-bold text-brand-primary">Shelter</h3>
                  <p className="mt-1 text-sm text-brand-muted">Emergency tents, blankets, and essential non-food items for IDPs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Interventions Alert */}
      <section className="bg-red-50 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 font-heading text-2xl font-bold text-red-700">Urgent: Flood Relief Appeal</h3>
          <p className="mb-6 text-red-600">
            Thousands have been displaced by recent flooding in the central regions. Our teams are on the ground, but we need your help to provide clean water and temporary shelter.
          </p>
          <Button asChild variant="cta" className="bg-red-600 hover:bg-red-700">
            <Link href="/donate?campaign=emergency-flood">Donate to Flood Relief</Link>
          </Button>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="bg-brand-primary py-24 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl">
            Join Our Response Team
          </h2>
          <p className="mb-8 text-white/80">
            Are you a medical professional, logistics expert, or dedicated volunteer? We need skilled individuals for our deployment roster.
          </p>
          <Button asChild variant="secondary" size="lg" className="bg-white text-brand-primary hover:bg-gray-100">
            <Link href="/volunteers">Apply to Volunteer</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
