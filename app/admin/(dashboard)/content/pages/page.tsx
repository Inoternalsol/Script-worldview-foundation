import { adminFetch } from '@/lib/admin-api'
import { PagesManagerClient } from '@/components/admin/PagesManagerClient'

type PageItem = {
  id: string
  title: string
  slug: string
  status: string
  updatedAt: string | number
}

async function getPages(): Promise<PageItem[]> {
  try {
    const res = await adminFetch('/pages')
    return res.data || []
  } catch {
    return []
  }
}

export default async function AdminPagesContentManager() {
  const pagesList = await getPages()
  return <PagesManagerClient pagesList={pagesList} />
}
