import Link from 'next/link'
import { format } from 'date-fns'

export type BlogCardProps = {
  title: string
  excerpt: string
  href: string
  category?: string
  publishedAt?: number
}

export function BlogCard({ title, excerpt, href, category, publishedAt }: BlogCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border border-border dark:border-white/10 bg-card dark:bg-slate-900 p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="flex items-center justify-between gap-3">
        {category ? (
          <div className="rounded-full bg-brand-primary/5 px-3 py-1 text-xs font-semibold text-brand-primary">
            {category}
          </div>
        ) : (
          <div />
        )}
        {publishedAt ? (
          <div className="text-xs text-brand-muted">{format(new Date(publishedAt), 'MMM d, yyyy')}</div>
        ) : null}
      </div>
      <div className="mt-3 font-heading text-lg font-semibold text-foreground group-hover:text-brand-primary">
        {title}
      </div>
      <div className="mt-2 line-clamp-3 text-sm leading-6 text-brand-muted">{excerpt}</div>
      <div className="mt-4 text-sm font-semibold text-brand-primary">Read more</div>
    </Link>
  )
}

