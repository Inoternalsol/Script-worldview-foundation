'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

interface DeleteButtonProps {
  id: string
  endpoint: string // e.g. '/api/admin/blog'
  label?: string
  redirectTo?: string
  onSuccess?: () => void
}

export function DeleteConfirmButton({
  id,
  endpoint,
  label = 'item',
  redirectTo,
  onSuccess,
}: DeleteButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast({ title: `${label} deleted`, description: `The ${label.toLowerCase()} has been permanently removed.` })
      setOpen(false)
      if (redirectTo) {
        startTransition(() => router.push(redirectTo))
      } else {
        startTransition(() => router.refresh())
      }
      onSuccess?.()
    } catch {
      toast({ title: 'Error', description: `Failed to delete ${label.toLowerCase()}.`, variant: 'destructive' })
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />
          {/* Dialog */}
          <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl mx-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  Delete {label}?
                </h3>
                <p className="mt-1 text-sm text-brand-muted">
                  This action is permanent and cannot be undone. The {label.toLowerCase()} will be immediately removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting…</>
                ) : (
                  <><Trash2 className="mr-2 h-4 w-4" />Delete {label}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
