import { PageHero } from '@/components/public/shared/PageHero'
import { EventCard } from '@/components/public/shared/EventCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock Data
const upcomingEvents = [
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

const pastEvents = [
  {
    id: '3',
    title: 'Education Fundraiser Gala 2023',
    slug: 'education-fundraiser-gala-2023',
    date: new Date('2023-11-10').getTime(),
    location: 'Transcorp Hilton, Abuja',
    description: 'Our annual gala to raise funds for the next academic year.',
    featuredImage: null,
    status: 'past' as const
  }
]

export default function EventsPage() {
  return (
    <div>
      <PageHero
        title="Events & Webinars"
        subtitle="Join us in person or online. Participate in our workshops, fundraisers, and community outreaches."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="mb-12 flex justify-center">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upcoming" className="mt-0">
              {upcomingEvents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      title={event.title}
                      href={`/events/${event.slug}`}
                      date={event.date}
                      location={event.location}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-brand-muted">
                  No upcoming events at the moment. Please check back later.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    title={event.title}
                    href={`/events/${event.slug}`}
                    date={event.date}
                    location={event.location}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </section>
    </div>
  )
}
