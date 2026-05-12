import { PageHero } from '@/components/public/shared/PageHero'

export default function TermsPage() {
  return (
    <div>
      <PageHero
        title="Terms of Use"
        subtitle="Last updated: October 2023"
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="prose prose-lg max-w-none text-brand-muted">
            <p>
              Welcome to the Script Worldview Foundation website. By accessing or using our website, you agree to be bound by these Terms of Use.
            </p>

            <h2 className="text-brand-primary">1. Use of the Site</h2>
            <p>
              You agree to use the site only for lawful purposes. You are prohibited from violating or attempting to violate the security of the site, including accessing data not intended for you or logging into a server or account that you are not authorized to access.
            </p>

            <h2 className="text-brand-primary">2. Intellectual Property</h2>
            <p>
              All content on this site, including text, graphics, logos, images, and software, is the property of Script Worldview Foundation or its content suppliers and is protected by international copyright laws.
            </p>

            <h2 className="text-brand-primary">3. Donations</h2>
            <p>
              All donations made through our website are subject to our refund policy. We use secure third-party payment gateways (Paystack and Stripe) to process your payments.
            </p>

            <h2 className="text-brand-primary">4. Disclaimer of Warranties</h2>
            <p>
              This site is provided "as is" without any representations or warranties, express or implied. Script Worldview Foundation makes no representations or warranties in relation to this website or the information and materials provided on this website.
            </p>

            <h2 className="text-brand-primary">5. Governing Law</h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
