'use client'

import { useState, useMemo } from 'react'
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
  AdminTableShell,
  TableSearch,
  TableFilter,
  Th,
  EmptyRow,
  StatusBadge,
  TablePagination,
} from '@/components/admin/AdminTable'

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

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending:   'bg-amber-100 text-amber-700',
  failed:    'bg-red-100 text-red-700',
  refunded:  'bg-blue-100 text-blue-700',
}

export function DonationsTableClient({ donations }: { donations: Donation[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [gatewayFilter, setGatewayFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const itemsPerPage = 10

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const res = await fetch('/api/admin/donations/export')
      if (!res.ok) throw new Error('Export failed')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'donations.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: 'Export Successful',
        description: 'Your donations list has been exported to CSV.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Export Failed',
        description: 'Failed to download donations CSV. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const filtered = useMemo(() => {
    return donations.filter((d) => {
      const q = search.toLowerCase()
      const matchSearch =
        !search ||
        d.donorName.toLowerCase().includes(q) ||
        d.donorEmail.toLowerCase().includes(q) ||
        d.paymentRef.toLowerCase().includes(q)
      const matchStatus = !statusFilter || d.status === statusFilter
      const matchGateway = !gatewayFilter || d.gateway === gatewayFilter
      return matchSearch && matchStatus && matchGateway
    })
  }, [donations, search, statusFilter, gatewayFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginated = useMemo(() => {
    return filtered.slice(startIndex, endIndex)
  }, [filtered, startIndex, endIndex])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const totalCompleted = donations
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0)

  return (
    <AdminTableShell
      title="Donations"
      subtitle={`${donations.length} transaction${donations.length !== 1 ? 's' : ''} · ₦${(totalCompleted / 100).toLocaleString()} raised`}
      headerAction={
        <Button
          onClick={handleExportCSV}
          disabled={isExporting}
          variant="outline"
          className="h-9 gap-2 border-border hover:bg-black/4"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export CSV
        </Button>
      }
      filterBar={
        <>
          <TableSearch value={search} onChange={setSearch} placeholder="Search by name, email, ref…" />
          <TableFilter
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              { label: 'Completed', value: 'completed' },
              { label: 'Pending', value: 'pending' },
              { label: 'Failed', value: 'failed' },
              { label: 'Refunded', value: 'refunded' },
            ]}
          />
          <TableFilter
            value={gatewayFilter}
            onChange={setGatewayFilter}
            placeholder="All Gateways"
            options={[
              { label: 'Paystack', value: 'paystack' },
              { label: 'Stripe', value: 'stripe' },
            ]}
          />
        </>
      }
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            <Th>Donor</Th>
            <Th>Email</Th>
            <Th>Amount</Th>
            <Th>Gateway</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <EmptyRow colSpan={7} message="No donations found." />
          ) : (
            paginated.map((don) => (
              <tr key={don.id} className="border-b border-border transition-colors hover:bg-muted/40">
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
                  <StatusBadge status={don.status} colorMap={STATUS_COLORS} />
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {new Date(don.donatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <DeleteConfirmButton
                    id={don.id}
                    endpoint="/api/admin/donations"
                    label="Donation"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filtered.length}
      />
    </AdminTableShell>
  )
}
