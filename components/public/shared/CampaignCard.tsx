import Link from 'next/link'
import { DonationProgressBar } from './DonationProgressBar'

export type CampaignCardProps = {
  title: string
  href: string
  goalAmount: number
  raisedAmount: number
}

export function CampaignCard({ title, href, goalAmount, raisedAmount }: CampaignCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-xl border border-black/10 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      <div className="font-heading text-lg font-semibold text-foreground group-hover:text-brand-primary">
        {title}
      </div>
      <div className="mt-4">
        <DonationProgressBar raised={raisedAmount} goal={goalAmount} label="Raised" />
      </div>
      <div className="mt-4 text-sm font-semibold text-brand-primary">Support this campaign</div>
    </Link>
  )
}

