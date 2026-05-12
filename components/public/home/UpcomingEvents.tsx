import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { EventCard } from '@/components/public/shared/EventCard'
import Link from 'next/link'

// Mock Data
const mockEvents = [
  {
    id: '1',
    title: 'Annual Community Outreach 2024',
    slug: 'annual-community-outreach-2024',
    date: new Date('2024-06-15').getTime(),
    location: 'Lagos City Hall',
    description: 'Join us for our largest community outreach program of the year.',
    featuredImage: null,
    status: 'upcoming' as const
  },
  {
    id: '2',
    title: 'Youth Leadership Seminar',
    slug: 'youth-leadership-seminar',
    date: new Date('2024-07-20').getTime(),
    location: 'Abuja Resource Center',
    description: 'A 2-day intensive seminar focusing on civic responsibility and leadership skills.',
    featuredImage: null,
    status: 'upcoming' as const
  }
]

export function UpcomingEvents() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHeader
          eyebrow="Get Involved"
          title="Upcoming Events"
          description="Join us in person or online to make a difference in your community."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {mockEvents.map((event) => (
            <EventCard 
              key={event.id} 
              title={event.title}
              href={`/events/${event.slug}`}
              date={event.date}
              location={event.location}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/events" 
            className="inline-flex font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            View All Events &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
