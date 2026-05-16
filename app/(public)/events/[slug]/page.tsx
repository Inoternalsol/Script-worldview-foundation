import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react'
import { EventRegistrationSection } from '@/components/public/events/EventRegistrationSection'

// Mock Data
const mockEvents = [
  {
    id: '1',
    title: 'Annual Community Outreach 2024',
    slug: 'annual-community-outreach-2024',
    date: new Date('2024-06-15T09:00:00').getTime(),
    endDate: new Date('2024-06-15T16:00:00').getTime(),
    location: 'Lagos City Hall',
    address: '123 Broad St, Lagos Island, Lagos',
    description: `
      <p>Join us for our largest community outreach program of the year. We will be providing free medical checkups, distributing educational materials, and offering business seminars for local entrepreneurs.</p>
      <h3>What to Expect</h3>
      <ul>
        <li>Free medical screenings (Blood pressure, sugar levels, vision)</li>
        <li>Distribution of 1,000 back-to-school kits</li>
        <li>Micro-business workshop (12:00 PM - 2:00 PM)</li>
        <li>Community town hall meeting</li>
      </ul>
      <h3>Who Should Attend?</h3>
      <p>This event is open to everyone in the community. Medical services and educational kits will be provided on a first-come, first-served basis.</p>
    `,
    capacity: 500,
    registrationsCount: 342,
    featuredImage: null,
    speakers: [
      { name: 'Dr. Emmanuel Okonkwo', role: 'Keynote Speaker' },
      { name: 'Mrs. Amina Yusuf', role: 'Panelist' }
    ],
    status: 'upcoming' as const
  },
  {
    id: '2',
    title: 'Youth Leadership Seminar',
    slug: 'youth-leadership-seminar',
    date: new Date('2024-07-20T10:00:00').getTime(),
    endDate: new Date('2024-07-21T16:00:00').getTime(),
    location: 'Jos Resource Center',
    address: 'Jos, Plateau State',
    description: `
      <p>A 2-day intensive seminar focusing on civic responsibility, leadership skills, and community engagement for young people between the ages of 18 and 30.</p>
      <h3>Seminar Highlights</h3>
      <ul>
        <li>Leadership Ethics and Values</li>
        <li>Public Speaking and Communication</li>
        <li>Community Project Planning</li>
        <li>Networking with Industry Leaders</li>
      </ul>
    `,
    capacity: 100,
    registrationsCount: 75,
    featuredImage: null,
    speakers: [
      { name: 'Rev. Joshua Sati', role: 'Founder' },
      { name: 'Sarah Nnamdi', role: 'Executive Director' }
    ],
    status: 'upcoming' as const
  },
  {
    id: '3',
    title: 'Education Fundraiser Gala 2023',
    slug: 'education-fundraiser-gala-2023',
    date: new Date('2023-11-10T18:00:00').getTime(),
    endDate: new Date('2023-11-10T22:00:00').getTime(),
    location: 'Hill Station Hotel, Jos',
    address: 'Tudun Wada, Jos, Plateau State',
    description: `
      <p>Our annual gala to raise funds for the next academic year. All proceeds go directly to our Scholarship Fund and School Infrastructure programs.</p>
    `,
    capacity: 200,
    registrationsCount: 198,
    featuredImage: null,
    speakers: [],
    status: 'past' as const
  }
]

export default function EventPage({ params }: { params: { slug: string } }) {
  // Mock fetching
  const event = mockEvents.find(e => e.slug === params.slug)

  if (!event) {
    notFound()
  }

  const startDate = new Date(event.date)
  const dateStr = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <article className="bg-background pb-20 pt-10">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        
        <Link href="/events" className="mb-8 inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Link>

        {/* Featured Image */}
        <div className="mb-12 aspect-[21/9] w-full rounded-2xl bg-gray-200"></div>

        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl">
              {event.title}
            </h1>
            
            <div className="mb-8 flex flex-wrap gap-6 text-sm text-brand-muted border-b border-black/10 pb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-primary" />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-primary" />
                <span>{timeStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-primary" />
                <span>{event.location}</span>
              </div>
            </div>

            <div 
              className="prose prose-lg max-w-none text-brand-muted prose-headings:font-heading prose-headings:text-brand-primary"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />

            {event.speakers && event.speakers.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-6 font-heading text-2xl font-bold text-brand-primary">Speakers</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {event.speakers.map((speaker, idx) => (
                    <div key={idx} className="flex items-center gap-4 rounded-xl border border-black/5 bg-white p-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 shrink-0"></div>
                      <div>
                        <div className="font-bold text-foreground">{speaker.name}</div>
                        <div className="text-sm text-brand-muted">{speaker.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Registration */}
          <div>
            <EventRegistrationSection 
              eventId={event.id}
              eventTitle={event.title}
              status={event.status}
              capacity={event.capacity}
              registrationsCount={event.registrationsCount}
            />
          </div>

        </div>
      </div>
    </article>
  )
}
