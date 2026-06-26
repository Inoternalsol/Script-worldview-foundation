import { adminFetch } from '@/lib/admin-api'
import { ContactsTableClient } from '@/components/admin/ContactsTableClient'

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  department: string | null
  message: string
  type: string
  status: string
  createdAt: string | number
}

async function getContacts(): Promise<Contact[]> {
  try {
    const res = await adminFetch('/contacts')
    return res.data ?? []
  } catch {
    return []
  }
}

export default async function ContactsAdminPage() {
  const contactsList = await getContacts()
  return <ContactsTableClient contacts={contactsList} />
}
