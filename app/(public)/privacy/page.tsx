import { PageHero } from '@/components/public/shared/PageHero'

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        title="Privacy Policy"
        subtitle="Last updated: October 2023"
      />
      <section className="bg-card py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="prose prose-lg max-w-none text-brand-muted">
            <p>
              Script Worldview Foundation ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>

            <h2 className="text-brand-primary">1. Information We Collect</h2>
            <p>
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li>Make a donation</li>
              <li>Register for an event</li>
              <li>Subscribe to our newsletter</li>
              <li>Fill out a contact form or application</li>
            </ul>
            <p>
              This information may include your name, email address, phone number, and payment details (processed securely by our third-party payment processors).
            </p>

            <h2 className="text-brand-primary">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Process your donations and issue receipts</li>
              <li>Send you updates about our programs and impact</li>
              <li>Respond to your inquiries</li>
              <li>Improve our website and services</li>
            </ul>

            <h2 className="text-brand-primary">3. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure.
            </p>

            <h2 className="text-brand-primary">4. Your Rights</h2>
            <p>
              In accordance with applicable data protection laws (including NDPR), you have the right to access, correct, or delete your personal data. You may also unsubscribe from our communications at any time.
            </p>

            <h2 className="text-brand-primary">5. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at contact@scriptworldview.org.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
