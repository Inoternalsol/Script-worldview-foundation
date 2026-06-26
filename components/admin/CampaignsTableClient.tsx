'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Pencil, Target, Calendar } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton'
import {
  AdminTableShell,
  TableSearch,
  TableFilter,
  Th,
  EmptyRow,
  StatusBadge,
  TablePagination,
} from '@/components/admin/AdminTable'

type Campaign = {
  id: string
  title: string
  slug: string
  goalAmount: number
  raisedAmount: number
  deadline: string | number | null
  status: string
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  paused: 'bg-amber-100 text-amber-700',
}

export function CampaignsTableClient({ campaigns }: { campaigns: Campaign[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const q = search.toLowerCase()
      const matchSearch = !search || c.title.toLowerCase().includes(q)
      const matchStatus = !statusFilter || c.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [campaigns, search, statusFilter])

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

  return (
    <AdminTableShell
      title="Fundraising Campaigns"
      subtitle={`${campaigns.length} total campaign${campaigns.length !== 1 ? 's' : ''}`}
      headerAction={
        <Button asChild variant="cta">
          <Link href="/admin/campaigns/new">
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Link>
        </Button>
      }
      filterBar={
        <>
          <TableSearch value={search} onChange={setSearch} placeholder="Search campaigns…" />
          <TableFilter
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Completed', value: 'completed' },
              { label: 'Paused', value: 'paused' },
            ]}
          />
        </>
      }
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            <Th>Campaign</Th>
            <Th>Status</Th>
            <Th>Progress & Funding</Th>
            <Th>Deadline</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <EmptyRow colSpan={5} message="No campaigns found." />
          ) : (
            paginated.map((campaign) => {
              const percent =
                campaign.goalAmount > 0
                  ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100))
                  : 0

              return (
                <tr
                  key={campaign.id}
                  className="border-b border-border transition-colors hover:bg-muted/40"
                >
                  <td className="px-4 py-4 font-medium text-foreground max-w-[200px] truncate">
                    {campaign.title}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={campaign.status} colorMap={STATUS_COLORS} />
                  </td>
                  <td className="px-4 py-4 min-w-[200px]">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-brand-primary">
                          ₦{campaign.raisedAmount.toLocaleString()} / ₦
                          {campaign.goalAmount.toLocaleString()}
                        </span>
                        <span className="text-brand-muted">{percent}%</span>
                      </div>
                      <Progress value={percent} className="h-1.5 bg-secondary" />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-brand-muted">
                    {campaign.deadline ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(campaign.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/campaigns/${campaign.id}`}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-brand-primary hover:bg-brand-primary/8 transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                      <a
                        href={`/campaigns/${campaign.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-brand-muted hover:bg-black/5 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </a>
                      <DeleteConfirmButton
                        id={campaign.id}
                        endpoint="/api/admin/campaigns"
                        label="Campaign"
                      />
                    </div>
                  </td>
                </tr>
              )
            })
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
