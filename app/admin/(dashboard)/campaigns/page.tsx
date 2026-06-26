import { adminFetch } from '@/lib/admin-api'
import { CampaignsTableClient } from '@/components/admin/CampaignsTableClient'

type Campaign = {
  id: string
  title: string
  slug: string
  goalAmount: number
  raisedAmount: number
  deadline: string | number | null
  status: string
}

async function getCampaigns(): Promise<Campaign[]> {
  try {
    const res = await adminFetch('/campaigns')
    return res.data ?? []
  } catch {
    return []
  }
}

export default async function AdminCampaignsPage() {
  const campaignsList = await getCampaigns()
  return <CampaignsTableClient campaigns={campaignsList} />
}
