import { adminFetch } from '@/lib/admin-api'
import { TransparencyManagerClient } from '@/components/admin/TransparencyManagerClient'

async function getTransparencyDocs() {
  try {
    const res = await adminFetch('/transparency')
    return res.data ?? []
  } catch {
    return []
  }
}

import { Suspense } from 'react'
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton'

async function TransparencyLoader() {
  const docs = await getTransparencyDocs()
  return <TransparencyManagerClient initialDocs={docs} />
}

export default function TransparencyAdminPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <TransparencyLoader />
    </Suspense>
  )
}
