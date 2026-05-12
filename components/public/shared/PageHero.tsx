import { ReactNode } from 'react'

export type PageHeroProps = {
  title: string
  subtitle?: string
  ctas?: ReactNode
}

export function PageHero({ title, subtitle, ctas }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-primary">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-brand-secondary blur-3xl" />
        <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-brand-cta blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
        <div className="max-w-3xl">
          <h1 className="font-heading text-3xl font-semibold leading-tight text-white md:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 text-base leading-7 text-white/85 md:text-lg">
              {subtitle}
            </p>
          ) : null}
          {ctas ? <div className="mt-8">{ctas}</div> : null}
        </div>
      </div>
    </section>
  )
}

