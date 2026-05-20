'use client';

import { PageHero } from '@/components/public/shared/PageHero'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TrainingRegistrationForm } from '@/components/public/forms/TrainingRegistrationForm'

// Mock Data
const workshops = [
  {
    id: 1,
    title: 'Non-Profit Leadership & Governance',
    date: 'August 15-17, 2024',
    format: 'In-Person (Jos)',
    duration: '3 Days',
    status: 'open'
  },
  {
    id: 2,
    title: 'Effective Grant Writing for CBOs',
    date: 'September 5, 2024',
    format: 'Virtual (Zoom)',
    duration: '1 Day',
    status: 'open'
  },
  {
    id: 3,
    title: 'Monitoring & Evaluation Masterclass',
    date: 'October 10-12, 2024',
    format: 'Hybrid',
    duration: '3 Days',
    status: 'upcoming'
  }
]

export default function CapacityBuildingPage() {
  return (
    <div>
      <PageHero
        title="Capacity Building"
        subtitle="Equipping community leaders, educators, and partner NGOs with the skills needed to maximize their impact."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 font-heading text-3xl font-bold text-brand-primary">Strengthening the Sector</h2>
              <p className="mb-4 text-lg text-brand-muted">
                We recognize that we cannot transform communities alone. Our capacity building program is designed to share our knowledge, frameworks, and best practices with other Community-Based Organizations (CBOs), local leaders, and educators.
              </p>
              <p className="text-lg text-brand-muted">
                Through intensive workshops, mentorship programs, and customized training modules, we build an ecosystem of capable leaders ready to tackle local challenges efficiently.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-brand-primary/5 p-6 text-center">
                <div className="font-heading text-3xl font-bold text-brand-primary">500+</div>
                <div className="mt-2 text-sm font-medium text-brand-muted">Organizations Trained</div>
              </div>
              <div className="rounded-xl bg-brand-secondary/10 p-6 text-center">
                <div className="font-heading text-3xl font-bold text-brand-secondary">50+</div>
                <div className="mt-2 text-sm font-medium text-brand-muted">Workshops Conducted</div>
              </div>
              <div className="col-span-2 rounded-xl bg-gray-50 p-6 text-center">
                <div className="font-heading text-3xl font-bold text-foreground">98%</div>
                <div className="mt-2 text-sm font-medium text-brand-muted">Participant Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Workshops */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <SectionHeader
            title="Upcoming Training & Workshops"
            description="Register for our upcoming capacity building sessions."
          />
          
          <div className="mt-12 space-y-6">
            {workshops.map((workshop) => (
              <div key={workshop.id} className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center">
                <div className="mb-6 sm:mb-0">
                  <h3 className="font-heading text-xl font-bold text-brand-primary">{workshop.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-brand-muted">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {workshop.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {workshop.duration}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {workshop.format}</span>
                  </div>
                </div>
                <div>
                  {workshop.status === 'open' ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="cta">
                          Register Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-brand-primary">Register for Workshop</DialogTitle>
                          <DialogDescription>
                            Sign up for "{workshop.title}". Fill out the details below to complete your registration.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 text-left">
                          <TrainingRegistrationForm />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Button variant="secondary" disabled>
                      Registration Closed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

