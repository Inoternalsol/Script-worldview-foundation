import { HeroSection } from '@/components/public/home/HeroSection'
import { ImpactCounter } from '@/components/public/home/ImpactCounter'
import { MissionStrip } from '@/components/public/home/MissionStrip'
import { FeaturedPrograms } from '@/components/public/home/FeaturedPrograms'
import { LatestNews } from '@/components/public/home/LatestNews'
import { DonateSection } from '@/components/public/home/DonateSection'
import { UpcomingEvents } from '@/components/public/home/UpcomingEvents'
import { TestimonialsCarousel } from '@/components/public/home/TestimonialsCarousel'
import { PartnersMarquee } from '@/components/public/home/PartnersMarquee'
import { NewsletterSignup } from '@/components/public/home/NewsletterSignup'
import { OrganizationJsonLd } from '@/components/public/shared/OrganizationJsonLd'
import { Reveal } from '@/components/public/shared/Reveal'

export const metadata = {
  title: 'Script Worldview Foundation — Shaping Minds, Transforming Communities',
  description:
    'A faith-inspired Nigerian NGO advancing education, humanitarian response, and community development across Nigeria since 2016.',
}

import { getServerEnv } from '@/lib/env'

export default async function HomePage() {
  const env = getServerEnv()
  let settings = null
  
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/settings/home_page`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    if (res.ok) {
      const json = await res.json()
      settings = json.data
    }
  } catch (error) {
    console.error('Failed to fetch home page settings:', error)
  }

  return (
    <>
      <OrganizationJsonLd />
      <div>
        <HeroSection title={settings?.heroTitle} subtitle={settings?.heroSubtitle} />
        <Reveal><ImpactCounter /></Reveal>
        <Reveal><MissionStrip highlight={settings?.missionHighlight} statement={settings?.missionStatement} /></Reveal>
        <Reveal><FeaturedPrograms /></Reveal>
        <Reveal><LatestNews /></Reveal>
        <Reveal><DonateSection /></Reveal>
        <Reveal><UpcomingEvents /></Reveal>
        <Reveal><TestimonialsCarousel /></Reveal>
        <Reveal><PartnersMarquee /></Reveal>
        <Reveal><NewsletterSignup /></Reveal>
      </div>
    </>
  )
}
