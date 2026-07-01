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

export default async function TeamAdminPage() {
  const members = await getTeamMembers()
  return <TeamManagerClient initialMembers={members} />
}
