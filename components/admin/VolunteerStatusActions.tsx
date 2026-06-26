'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface VolunteerActionsProps {
  id: string
  currentStatus: string
}

export function VolunteerStatusActions({ id, currentStatus }: VolunteerActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus)

  async function updateStatus(newStatus: string) {
    setOptimisticStatus(newStatus)
    try {
      const res = await fetch(`/api/admin/volunteers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      toast({
        title: newStatus === 'approved' ? '✅ Volunteer Approved' : '❌ Application Rejected',
        description: `Status changed to ${newStatus}.`,
      })
      startTransition(() => router.refresh())
    } catch {
      setOptimisticStatus(currentStatus) // rollback
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' })
    }
  }

  if (optimisticStatus === 'approved') {
    return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700"><CheckCircle className="h-3 w-3" /> Approved</span>
  }
  if (optimisticStatus === 'rejected') {
    return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700"><XCircle className="h-3 w-3" /> Rejected</span>
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 capitalize">
        {optimisticStatus}
      </span>
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-muted" />
      ) : (
        <>
          <button
            onClick={() => updateStatus('approved')}
            title="Approve volunteer"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
          >
            <CheckCircle className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => updateStatus('rejected')}
            title="Reject application"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <XCircle className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  )
}
