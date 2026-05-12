import { PageHero } from '@/components/public/shared/PageHero'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { ContactForm } from '@/components/public/forms/ContactForm'

// Note: ContactForm will be built in Phase 4. Using placeholder for now.
export default function ContactPage() {
  return (
    <div>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to us for inquiries, partnerships, or support."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 font-heading text-3xl font-bold text-brand-primary">Get in Touch</h2>
                <p className="text-brand-muted">
                  Whether you have a question about our programs, want to volunteer, or are interested in partnering with us, our team is ready to answer all your questions.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Our Office</h3>
                    <p className="mt-1 text-brand-muted">
                      123 Foundation Way, <br />
                      Wuse II, Abuja, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Phone</h3>
                    <p className="mt-1 text-brand-muted">+234 (0) 000 000 0000</p>
                    <p className="text-sm text-brand-muted">Mon-Fri, 9am - 5pm WAT</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Email</h3>
                    <p className="mt-1 text-brand-muted">hello@scriptworldviewfoundation.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-card">
              <h3 className="mb-6 font-heading text-2xl font-bold text-brand-primary">Send a Message</h3>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Map (Static placeholder) */}
      <section className="h-96 w-full bg-gray-200">
        <div className="flex h-full items-center justify-center text-brand-muted">
          Google Maps Embed
        </div>
      </section>
    </div>
  )
}
