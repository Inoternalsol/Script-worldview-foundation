import { adminFetch } from '@/lib/admin-api'

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
    return res.data
  } catch {
    return []
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'resolved':
      return 'bg-green-100 text-green-700'
    case 'in_progress':
      return 'bg-blue-100 text-blue-700'
    case 'new':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function ContactsAdminPage() {
  const contacts = await getContacts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Contact Messages</h1>
        <p className="mt-1 text-sm text-brand-muted">
          {contacts.length} message{contacts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-gray-50/50">
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Subject</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Department</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-brand-muted">
                    No contact messages yet.
                  </td>
                </tr>
              ) : (
                contacts.map((msg) => (
                  <tr key={msg.id} className="border-b border-black/5 transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-foreground">{msg.name}</td>
                    <td className="px-4 py-3 text-brand-muted">{msg.email}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-brand-muted">
                      {msg.subject || '—'}
                    </td>
                    <td className="px-4 py-3 capitalize text-brand-muted">{msg.department || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(msg.status)}`}>
                        {msg.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {new Date(msg.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
