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

import { Suspense } from 'react'
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton'

async function DonationsLoader() {
  const donations = await getDonations()
  return <DonationsTableClient donations={donations} />
}

export default function DonationsAdminPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <DonationsLoader />
    </Suspense>
  )
}
