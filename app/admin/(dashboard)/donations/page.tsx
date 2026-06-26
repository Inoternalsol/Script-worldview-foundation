import { adminFetch } from '@/lib/admin-api'
import { DonationsTableClient } from '@/components/admin/DonationsTableClient'

type Donation = {
  id: string
  donorName: string
  donorEmail: string
  donorPhone: string | null
  amount: number
  currency: string
  campaignId: string | null
  paymentRef: string
  gateway: string
  status: string
  anonymous: boolean
  donatedAt: string | number
}

async function getDonations(): Promise<Donation[]> {
  try {
    const res = await adminFetch('/donations')
    return res.data ?? []
  } catch {
    return []
  }
}

export default async function DonationsAdminPage() {
  const donations = await getDonations()
  return <DonationsTableClient donations={donations} />
}
