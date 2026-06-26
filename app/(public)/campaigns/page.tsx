import { PageHero } from '@/components/public/shared/PageHero'
import { CampaignCard } from '@/components/public/shared/CampaignCard'
import { apiFetch } from '@/lib/api/client'

// Fallback Mock Data
const fallbackCampaigns = [
  {
    id: '1',
    title: 'Back to School Drive 2024',
    slug: 'back-to-school-2024',
    description: 'Providing school supplies, uniforms, and books for 1,000 students.',
    goalAmount: 15000000,
    raisedAmount: 8500000,
    donorCount: 245,
    featuredImage: null
  },
  {
    id: '2',
    title: 'Emergency Flood Relief Fund',
    slug: 'emergency-flood-relief',
    description: 'Urgent supplies for families displaced by the recent floods.',
    goalAmount: 25000000,
    raisedAmount: 21000000,
    donorCount: 512,
    featuredImage: null
  }
]

export const revalidate = 1800

export default async function CampaignsPage() {
  let campaigns = fallbackCampaigns

  try {
    const res = await apiFetch<any>('/api/campaigns')
    if (res.ok && res.data && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        campaigns = res.data
      }
    }
  } catch (error) {
    console.error('Failed to load campaigns from API:', error)
  }

  return (
    <div>
      <PageHero
        title="Active Campaigns"
        subtitle="Join hands with us to reach specific goals and make targeted impacts in communities that need it most."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard 
                key={campaign.id} 
                title={campaign.title}
                href={`/campaigns/${campaign.slug}`}
                goalAmount={campaign.goalAmount}
                raisedAmount={campaign.raisedAmount}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

