import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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

interface EventType {
  id: string
  title: string
  slug: string
  date: number
  endDate?: number | null
  location: string | null
  address?: string | null
  description: string
  capacity?: number | null
  registrationsCount: number
  featuredImage: string | null
  speakers?: any[]
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled'
}

import { apiFetch } from '@/lib/api/client'

export const revalidate = 1800

async function getEventData(slug: string): Promise<EventType | undefined> {
  let event: EventType | undefined = mockEvents.find(e => e.slug === slug) as any

  try {
    const res = await apiFetch<any>(`/api/events/${slug}`)
    if (res.ok && res.data) {
      const data = res.data
      let speakers: any[] = []
      if (data.speakersJson) {
        try {
          speakers = JSON.parse(data.speakersJson)
        } catch {}
      }

      event = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        date: new Date(data.date).getTime(),
        endDate: data.endDate ? new Date(data.endDate).getTime() : null,
        location: data.location || 'TBD',
        address: data.address || '',
        description: data.description,
        capacity: data.capacity || 0,
        registrationsCount: data.registrationsCount || 0,
        featuredImage: data.featuredImage || null,
        speakers,
        status: data.status || 'upcoming'
      }
    }
  } catch (error) {
    console.error('Failed to load event details from API:', error)
  }
  return event
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEventData(params.slug)
  if (!event) return {}

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://scriptworldviewfoundation.org'
  const ogImage = event.featuredImage || `${APP_URL}/images/og-image.png`
  const description = event.description.replace(/<[^>]*>/g, '').substring(0, 155) + '...'

  return {
    title: `${event.title} | Script Worldview Foundation`,
    description,
    openGraph: {
      title: event.title,
      description,
      url: `${APP_URL}/events/${event.slug}`,
      type: 'website',
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${APP_URL}/events/${event.slug}`,
    }
  }
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEventData(params.slug)

  if (!event) {
    notFound()
  }

  const startDate = new Date(event.date)
  const dateStr = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: new Date(event.date).toISOString(),
    endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location || 'TBD',
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address || ''
      }
    },
    image: event.featuredImage ? [event.featuredImage] : [],
    description: event.description.replace(/<[^>]*>/g, '').substring(0, 155) + '...',
    performer: event.speakers?.map(s => ({
      '@type': 'Person',
      name: s.name
    })) || []
  }

  return (
    <article className="bg-background pb-20 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        
        <Link href="/events" className="mb-8 inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Link>

        {/* Featured Image */}
        {event.featuredImage ? (
          <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-secondary shadow-lg">
            <Image 
              src={event.featuredImage} 
              alt={event.title} 
              fill 
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMWEzYTVjIi8+PC9zdmc+"
            />
          </div>
        ) : (
          <div className="relative mb-12 flex aspect-[21/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-primary via-brand-primary/90 to-[#0F2236] p-8 text-center shadow-lg">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-accent">
                Script Worldview Foundation Event
              </span>
              <h2 className="font-heading text-2xl font-black text-white sm:text-3xl md:text-4xl">
                {event.title}
              </h2>
            </div>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl">
              {event.title}
            </h1>
            
            <div className="mb-8 flex flex-wrap gap-6 text-sm text-brand-muted border-b border-border pb-8">
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
                    <div key={idx} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                      <div className="h-12 w-12 rounded-full bg-secondary/80 shrink-0"></div>
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
              capacity={event.capacity ?? undefined}
              registrationsCount={event.registrationsCount}
            />
          </div>

        </div>
      </div>
    </article>
  )
}
