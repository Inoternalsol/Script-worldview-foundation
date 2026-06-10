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
                      Jos, Plateau State, Nigeria
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

      {/* Map (Real Google Maps iframe embed) */}
      <section className="relative h-96 w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125792.83648057403!2d8.824248425126867!3d9.895556272445839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10f3db537db1bf79%3A0x8673a5a73e658e45!2sJos%2C%20Plateau!5e0!3m2!1sen!2sng!4v1716900000000!5m2!1sen!2sng"
          width="100%"
          height="100%"
          style={{ border: 0 }}
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
