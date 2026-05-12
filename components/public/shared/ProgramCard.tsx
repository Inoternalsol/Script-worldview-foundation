import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export type ProgramCardProps = {
  title: string
  description: string
  href: string
  category?: string
}

export function ProgramCard({ title, description, href, category }: ProgramCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border border-black/10 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      {category ? (
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
          {category}
        </div>
      ) : null}
      <div className="mt-2 font-heading text-lg font-semibold text-foreground group-hover:text-brand-primary">
        {title}
      </div>
      <div className="mt-2 text-sm leading-6 text-brand-muted">{description}</div>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
        Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

