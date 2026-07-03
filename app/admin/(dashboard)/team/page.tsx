import { adminFetch } from '@/lib/admin-api'
import { TeamManagerClient } from '@/components/admin/TeamManagerClient'

async function getTeamMembers() {
  try {
    const res = await adminFetch('/team')
    return res.data ?? []
  } catch {
    return []
  }
}

import { Suspense } from 'react'
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton'

async function TeamLoader() {
  const members = await getTeamMembers()
  return <TeamManagerClient initialMembers={members} />
}

export default function TeamAdminPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <TeamLoader />
    </Suspense>
  )
}
