import { ReactNode } from 'react'
import Image from 'next/image'

export type PageHeroProps = {
  title: string
  subtitle?: string
  ctas?: ReactNode
  backgroundImage?: string
}

export function PageHero({ title, subtitle, ctas, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-brand-primary dark:bg-slate-950 text-white">
      {backgroundImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-brand-primary/85 mix-blend-multiply" />
        </div>
      ) : (
        <div className="absolute inset-0 opacity-30 z-0">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-brand-secondary blur-3xl" />
          <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-brand-cta blur-3xl" />
        </div>
      )}
      
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-24">
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

