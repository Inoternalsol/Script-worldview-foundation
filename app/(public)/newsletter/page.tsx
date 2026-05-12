import { PageHero } from '@/components/public/shared/PageHero'
import { NewsletterSignup as NewsletterComponent } from '@/components/public/home/NewsletterSignup'

export default function NewsletterPage() {
  return (
    <div>
      <PageHero
        title="Newsletter"
        subtitle="Join our community of supporters. Stay updated on our latest projects, impact stories, and upcoming events."
      />

      <div className="bg-background py-12">
        <NewsletterComponent />
      </div>

      <section className="bg-white py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <h2 className="mb-6 font-heading text-3xl font-bold text-brand-primary">What to Expect</h2>
          <div className="grid gap-8 md:grid-cols-3 mt-12">
            <div>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 font-bold text-brand-primary">1</div>
              <h3 className="mb-2 font-bold text-foreground">Monthly Updates</h3>
              <p className="text-sm text-brand-muted">A concise summary of our activities, delivered directly to your inbox once a month.</p>
            </div>
            <div>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 font-bold text-brand-primary">2</div>
              <h3 className="mb-2 font-bold text-foreground">Impact Stories</h3>
              <p className="text-sm text-brand-muted">Real stories and testimonials from the individuals your support helps transform.</p>
            </div>
            <div>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 font-bold text-brand-primary">3</div>
              <h3 className="mb-2 font-bold text-foreground">Emergency Alerts</h3>
              <p className="text-sm text-brand-muted">Urgent notifications when disaster strikes and immediate humanitarian action is needed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
