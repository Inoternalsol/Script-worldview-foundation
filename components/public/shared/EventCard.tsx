import Link from 'next/link'
import { CalendarDays, MapPin } from 'lucide-react'
import { format } from 'date-fns'

export type EventCardProps = {
  title: string
  href: string
  date: number
  location?: string
}

export function EventCard({ title, href, date, location }: EventCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border border-border dark:border-white/10 bg-card dark:bg-slate-900 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="font-heading text-lg font-semibold text-foreground group-hover:text-brand-primary">
        {title}
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-brand-muted">
        <CalendarDays className="h-4 w-4" />
        <span>{format(new Date(date), 'EEE, MMM d')}</span>
      </div>
      {location ? (
        <div className="mt-2 flex items-center gap-2 text-sm text-brand-muted">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{location}</span>
        </div>
      ) : null}
      <div className="mt-4 text-sm font-semibold text-brand-primary">Register</div>
    </Link>
  )
}

