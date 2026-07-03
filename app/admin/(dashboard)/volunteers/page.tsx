import { adminFetch } from '@/lib/admin-api'
import { VolunteersTable } from '@/components/admin/VolunteersTable'

type Volunteer = {
  id: string
  name: string
  email: string
  phone: string | null
  location: string | null
  status: string
  appliedAt: string | number
}

async function getVolunteers(): Promise<Volunteer[]> {
  try {
    const res = await adminFetch('/volunteers')
    return res.data ?? []
  } catch {
    return []
  }
}

import { Suspense } from 'react'
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton'

async function VolunteersLoader() {
  const volunteers = await getVolunteers()
  return <VolunteersTable volunteers={volunteers} />
}

export default function VolunteersAdminPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <VolunteersLoader />
    </Suspense>
  )
}
