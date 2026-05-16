export type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  light?: boolean
  centered?: boolean
}

export function SectionHeader({ eyebrow, title, description, light, centered }: SectionHeaderProps) {
  return (
    <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      {eyebrow ? (
        <div className={`text-xs font-semibold uppercase tracking-wider ${light ? 'text-brand-secondary/80' : 'text-brand-secondary'}`}>
          {eyebrow}
        </div>
      ) : null}
      <h2 className={`mt-2 font-heading text-2xl font-semibold leading-tight md:text-3xl ${light ? 'text-white' : 'text-foreground'}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-3 text-sm leading-6 md:text-base ${light ? 'text-white/90' : 'text-brand-muted'}`}>
          {description}
        </p>
      ) : null}
    </div>
  )
}

