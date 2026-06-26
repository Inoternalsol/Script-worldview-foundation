import { PageHero } from '@/components/public/shared/PageHero'
import { EventCard } from '@/components/public/shared/EventCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiFetch } from '@/lib/api/client'

// Fallback Mock Data
const fallbackUpcomingEvents = [
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
    location: 'Jos Resource Center',
    description: 'A 2-day intensive seminar focusing on civic responsibility and leadership skills.',
    featuredImage: null,
    status: 'upcoming' as const
  }
]

const fallbackPastEvents = [
  {
    id: '3',
    title: 'Education Fundraiser Gala 2023',
    slug: 'education-fundraiser-gala-2023',
    date: new Date('2023-11-10').getTime(),
    location: 'Hill Station Hotel, Jos',
    description: 'Our annual gala to raise funds for the next academic year.',
    featuredImage: null,
    status: 'past' as const
  }
]

export const revalidate = 1800 // Cache events at most 30 minutes

export default async function EventsPage() {
  let upcoming = fallbackUpcomingEvents
  let past = fallbackPastEvents

  try {
    const upcomingRes = await apiFetch<any>('/api/events?status=upcoming')
    if (upcomingRes.ok && upcomingRes.data && Array.isArray(upcomingRes.data)) {
      if (upcomingRes.data.length > 0) {
        upcoming = upcomingRes.data.map((e: any) => ({
          ...e,
          date: new Date(e.date).getTime(),
          endDate: e.endDate ? new Date(e.endDate).getTime() : null,
        }))
      }
    }
  } catch (error) {
    console.error('Failed to load upcoming events from API:', error)
  }

  try {
    const pastRes = await apiFetch<any>('/api/events?status=past')
    if (pastRes.ok && pastRes.data && Array.isArray(pastRes.data)) {
      if (pastRes.data.length > 0) {
        past = pastRes.data.map((e: any) => ({
          ...e,
          date: new Date(e.date).getTime(),
          endDate: e.endDate ? new Date(e.endDate).getTime() : null,
        }))
      }
    }
  } catch (error) {
    console.error('Failed to load past events from API:', error)
  }

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
              {upcoming.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((event) => (
                    <EventCard 
                      key={event.id} 
                      title={event.title}
                      href={`/events/${event.slug}`}
                      date={event.date}
                      location={event.location || 'TBD'}
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
              {past.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {past.map((event) => (
                    <EventCard 
                      key={event.id} 
                      title={event.title}
                      href={`/events/${event.slug}`}
                      date={event.date}
                      location={event.location || 'TBD'}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-brand-muted">
                  No past events recorded.
                </div>
              )}
            </TabsContent>
          </Tabs>

        </div>
      </section>
    </div>
  )
}

