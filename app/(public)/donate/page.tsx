import { DonationHeroSection } from '@/components/public/donate/DonationHeroSection'
import { DonationFormCard } from '@/components/public/donate/DonationFormCard'
import { DonationImpact } from '@/components/public/donate/DonationImpact'
import { DonationTransparency } from '@/components/public/donate/DonationTransparency'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donate — Support Our Mission',
  description:
    'Every contribution to Script Worldview Foundation transforms lives through education, humanitarian relief, and community empowerment. Donate securely today.',
}

export default function DonatePage() {
  return (
    <div>
      <DonationHeroSection />
      <section className="bg-[#F7F8FA] py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:px-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <DonationImpact />
          <DonationFormCard />
        </div>
      </section>
      <DonationTransparency />
    </div>
  )
}
