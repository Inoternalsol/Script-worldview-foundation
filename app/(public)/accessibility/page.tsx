import { PageHero } from '@/components/public/shared/PageHero'

export default function AccessibilityPage() {
  return (
    <div>
      <PageHero
        title="Accessibility Statement"
        subtitle="Our commitment to an inclusive digital experience."
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="prose prose-lg max-w-none text-brand-muted">
            <p>
              Script Worldview Foundation is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>

            <h2 className="text-brand-primary">Conformance Status</h2>
            <p>
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We aim to conform with WCAG 2.1 level AA standards.
            </p>

            <h2 className="text-brand-primary">Feedback</h2>
            <p>
              We welcome your feedback on the accessibility of the Script Worldview Foundation website. Please let us know if you encounter accessibility barriers:
            </p>
            <ul>
              <li>Email: accessibility@scriptworldviewfoundation.org</li>
              <li>Phone: +234 (0) 000 000 0000</li>
            </ul>
            <p>
              We try to respond to feedback within 2 business days.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
