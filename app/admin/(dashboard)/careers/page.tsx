import { adminFetch } from '@/lib/admin-api'
import { CareersTableClient } from '@/components/admin/CareersTableClient'

type Job = {
  id: string
  title: string
  department: string | null
  location: string | null
  type: string
  status: string
  deadline: string | number | null
  createdAt: string | number
}

async function getJobs(): Promise<Job[]> {
  try {
    const res = await adminFetch('/careers')
    return res.data ?? []
  } catch {
    return []
  }
}

export default async function CareersAdminPage() {
  const jobs = await getJobs()
  return <CareersTableClient jobs={jobs} />
}
