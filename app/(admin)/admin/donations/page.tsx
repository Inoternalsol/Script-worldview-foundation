import { adminFetch } from '@/lib/admin-api'

type Donation = {
  id: string
  donorName: string
  donorEmail: string
  donorPhone: string | null
  amount: number
  currency: string
  campaignId: string | null
  paymentRef: string
  gateway: string
  status: string
  anonymous: boolean
  donatedAt: string | number
}

async function getDonations(): Promise<Donation[]> {
  try {
    const res = await adminFetch('/donations')
    return res.data
  } catch {
    return []
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'failed':
      return 'bg-red-100 text-red-700'
    case 'refunded':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function DonationsAdminPage() {
  const donations = await getDonations()

  const totalCompleted = donations
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Donations</h1>
          <p className="mt-1 text-sm text-brand-muted">
            {donations.length} transaction{donations.length !== 1 ? 's' : ''} · ₦{(totalCompleted / 100).toLocaleString()} raised
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-gray-50/50">
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Donor</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Gateway</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-brand-muted">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-brand-muted">
                    No donations recorded yet.
                  </td>
                </tr>
              ) : (
                donations.map((don) => (
                  <tr key={don.id} className="border-b border-black/5 transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {don.anonymous ? 'Anonymous' : don.donorName}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{don.donorEmail}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {don.currency === 'NGN' ? '₦' : '$'}
                      {(don.amount / 100).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-brand-muted capitalize">{don.gateway}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColor(don.status)}`}>
                        {don.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {new Date(don.donatedAt).toLocaleDateString('en-US', {
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
