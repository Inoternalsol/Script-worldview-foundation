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

export default async function TransparencyAdminPage() {
  const docs = await getTransparencyDocs()
  return <TransparencyManagerClient initialDocs={docs} />
}
