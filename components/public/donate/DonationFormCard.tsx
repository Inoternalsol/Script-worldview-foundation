'use client'

import { DonationForm } from '@/components/public/forms/DonationForm'

export function DonationFormCard() {
  return (
    <div className="sticky top-24">
      <DonationForm noCardStyle={false} className="shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-border" />
    </div>
  )
}
