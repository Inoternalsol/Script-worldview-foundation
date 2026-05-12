export type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-2 font-heading text-2xl font-semibold leading-tight text-foreground md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-brand-muted md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  )
}

