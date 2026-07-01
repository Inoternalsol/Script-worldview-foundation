import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Target, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DonationProgressBar } from '@/components/public/shared/DonationProgressBar'
import { SocialShareButtons } from '@/components/public/shared/SocialShareButtons'

// Mock Data
const mockCampaigns = [
  {
    id: '1',
    title: 'Back to School Drive 2024',
    slug: 'back-to-school-2024',
    description: `
      <p>Every child deserves the right to education, but for many families in rural areas, the cost of basic school supplies is a barrier too high to overcome. The Back to School Drive aims to equip 1,000 students with everything they need to start the new academic year successfully.</p>
      <h3>What Your Donation Provides</h3>
      <ul>
        <li><strong>₦5,000</strong> provides a complete set of notebooks and stationery.</li>
        <li><strong>₦15,000</strong> provides two sets of school uniforms and a pair of shoes.</li>
        <li><strong>₦30,000</strong> provides a fully stocked backpack and covers PTA levies for a term.</li>
      </ul>
      <p>Join us in removing these barriers and keeping children in the classroom where they belong.</p>
    `,
    goalAmount: 15000000,
    raisedAmount: 8500000,
    donorCount: 245,
    featuredImage: null
  },
  {
    id: '2',
    title: 'Emergency Flood Relief Fund',
    slug: 'emergency-flood-relief',
    description: `
      <p>The recent floods have devastated several communities in Plateau State, leaving hundreds of families without shelter or clean water. This emergency fund is dedicated to providing immediate relief and supporting the long-term recovery of those affected.</p>
      <h3>Relief Priorities</h3>
      <ul>
        <li>Emergency food and water supply</li>
        <li>Temporary shelter and blankets</li>
        <li>Medical aid and hygiene kits</li>
      </ul>
    `,
    goalAmount: 25000000,
    raisedAmount: 21000000,
    donorCount: 512,
    featuredImage: '/images/blog/flood-relief.png'
  }
]

import { apiFetch } from '@/lib/api/client'

export const revalidate = 1800

export default async function CampaignPage({ params }: { params: { slug: string } }) {
  let campaign = mockCampaigns.find(c => c.slug === params.slug)

  try {
    const res = await apiFetch<any>(`/api/campaigns/${params.slug}`)
    if (res.ok && res.data) {
      campaign = res.data
    }
  } catch (error) {
    console.error('Failed to load campaign details from API:', error)
  }

  if (!campaign) {
    notFound()
  }


  return (
    <article className="bg-background pb-20 pt-10">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        
        <Link href="/campaigns" className="mb-8 inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
        </Link>

        {/* Featured Image */}
        <div className="mb-12 aspect-[21/9] w-full rounded-2xl bg-secondary/80"></div>

        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl">
              {campaign.title}
            </h1>
            
            <div 
              className="prose prose-lg max-w-none text-brand-muted prose-headings:font-heading prose-headings:text-brand-primary"
              dangerouslySetInnerHTML={{ __html: campaign.description }}
            />
            <div className="mt-8">
              <SocialShareButtons title={campaign.title} />
            </div>
          </div>

          {/* Sidebar / Donation */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="mb-6 font-heading text-xl font-bold text-brand-primary">Campaign Progress</h3>
              
              <div className="mb-6">
                <DonationProgressBar 
                  goal={campaign.goalAmount} 
                  raised={campaign.raisedAmount} 
                />
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4 text-center">
                <div className="rounded-xl bg-gray-50 p-4">
                  <Target className="mx-auto mb-2 h-6 w-6 text-brand-secondary" />
                  <div className="text-sm font-bold text-foreground">₦{(campaign.goalAmount / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-brand-muted">Goal</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <Users className="mx-auto mb-2 h-6 w-6 text-brand-secondary" />
                  <div className="text-sm font-bold text-foreground">{campaign.donorCount}</div>
                  <div className="text-xs text-brand-muted">Donors</div>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild variant="cta" className="w-full">
                  <Link href={`/donate?campaign=${campaign.slug}`}>Donate to Campaign</Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </article>
  )
}
