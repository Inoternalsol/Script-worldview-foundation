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

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ImpactCounter />
      <MissionStrip />
      <FeaturedPrograms />
      <LatestNews />
      <DonateSection />
      <UpcomingEvents />
      <TestimonialsCarousel />
      <PartnersMarquee />
      <NewsletterSignup />
    </div>
  )
}
