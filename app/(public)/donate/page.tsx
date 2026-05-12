import { PageHero } from '@/components/public/shared/PageHero'
import { DonateSection } from '@/components/public/home/DonateSection'

export default function DonatePage() {
  return (
    <div>
      <PageHero
        title="Donate"
        subtitle="Your generosity allows us to continue shaping minds and transforming communities. Thank you for your support."
      />

      <DonateSection />
      
      {/* Donor Wall / Transparency */}
      <section className="bg-background py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <h2 className="mb-6 font-heading text-3xl font-bold text-brand-primary">Our Commitment to Transparency</h2>
          <p className="text-lg text-brand-muted">
            We ensure that every Naira, Dollar, and Pound is maximized for impact. 90% of all donations go directly to programmatic activities, with only 10% used for administrative and operational costs.
          </p>
        </div>
      </section>
    </div>
  )
}
