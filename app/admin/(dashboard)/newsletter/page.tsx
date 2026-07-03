import { adminFetch } from '@/lib/admin-api'
import { NewsletterSubscribersTable } from '@/components/admin/NewsletterSubscribersTable'

type Subscriber = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  status: string
  subscribedAt: string | number
}

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const res = await adminFetch('/newsletter')
    return res.data ?? []
  } catch {
    return []
  }
}

export default async function NewsletterAdminPage() {
  const subscribers = await getSubscribers()
  return <NewsletterSubscribersTable subscribers={subscribers} />
}
