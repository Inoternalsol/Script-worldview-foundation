import Link from 'next/link'

export type StoryCardProps = {
  title: string
  excerpt: string
  href: string
  location?: string
  tag?: string
}

export function StoryCard({ title, excerpt, href, location, tag }: StoryCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border border-black/10 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="flex items-center justify-between gap-3">
        {tag ? (
          <div className="rounded-full bg-brand-secondary/10 px-3 py-1 text-xs font-semibold text-brand-secondary">
            {tag}
          </div>
        ) : (
          <div />
        )}
        {location ? <div className="text-xs text-brand-muted">{location}</div> : null}
      </div>
      <div className="mt-3 font-heading text-lg font-semibold text-foreground group-hover:text-brand-primary">
        {title}
      </div>
      <div className="mt-2 line-clamp-3 text-sm leading-6 text-brand-muted">{excerpt}</div>
      <div className="mt-4 text-sm font-semibold text-brand-primary">Read the story</div>
    </Link>
  )
}

