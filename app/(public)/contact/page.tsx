import { PageHero } from '@/components/public/shared/PageHero'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { ContactForm } from '@/components/public/forms/ContactForm'

// Note: ContactForm will be built in Phase 4. Using placeholder for now.
import { getServerEnv } from '@/lib/env'

export default async function ContactPage() {
  const env = getServerEnv()
  let settings = null

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/settings/contact_page`, {
      next: { revalidate: 60 }
    })
    if (res.ok) {
      const json = await res.json()
      settings = json.data
    }
  } catch (error) {
    console.error('Failed to fetch contact page settings:', error)
  }

  const heroTitle = settings?.heroTitle || "Contact Us"
  const heroSubtitle = settings?.heroSubtitle || "We'd love to hear from you. Reach out to us for inquiries, partnerships, or support."
  const introHeadline = settings?.introHeadline || "Get in Touch"
  const introText = settings?.introText || "Whether you have a question about our programs, want to volunteer, or are interested in partnering with us, our team is ready to answer all your questions."
  const addressTitle = settings?.addressTitle || "Our Office Headquarters"
  const addressDetails = settings?.addressDetails || "123 Foundation Way, Jos, Plateau State, Nigeria"
  const phonePrimary = settings?.phonePrimary || "+234 800 123 4567"
  const phoneSecondary = settings?.phoneSecondary || "+234 801 987 6543"
  const emailPrimary = settings?.emailPrimary || "info@scriptworldviewfoundation.org"
  const emailSecondary = settings?.emailSecondary || "partnerships@scriptworldviewfoundation.org"
  const hoursDetails = settings?.hoursDetails || "Monday — Friday: 8:00 AM — 5:00 PM (WAT)"

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 font-heading text-3xl font-bold text-brand-primary">{introHeadline}</h2>
                <p className="text-brand-muted">
                  {introText}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{addressTitle}</h3>
                    <p className="mt-1 text-brand-muted whitespace-pre-line">
                      {addressDetails}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Telephone Desk</h3>
                    <p className="mt-1 text-brand-muted">{phonePrimary}</p>
                    {phoneSecondary && <p className="text-sm text-brand-muted">{phoneSecondary}</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Inquiry Email</h3>
                    <p className="mt-1 text-brand-muted">{emailPrimary}</p>
                    {emailSecondary && <p className="text-sm text-brand-muted">{emailSecondary}</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Working Hours</h3>
                    <p className="mt-1 text-brand-muted">{hoursDetails}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-border dark:border-white/10 bg-card dark:bg-slate-900 p-8 shadow-card">
              <h3 className="mb-6 font-heading text-2xl font-bold text-brand-primary">Send a Message</h3>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Map (Real Google Maps iframe embed) */}
      <section className="relative h-96 w-full">
        <iframe
          src="https://maps.google.com/maps?q=Jos,+Plateau+State,+Nigeria&t=&z=13&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location Map"
          className="absolute inset-0"
        ></iframe>
      </section>
    </div>
  )
}
