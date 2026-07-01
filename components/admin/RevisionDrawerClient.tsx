'use client'

import React, { useState, useEffect } from 'react'
import { History, RotateCcw, X, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface Revision {
  id: string
  entityId: string
  entityType: 'page' | 'blog_post'
  title: string
  snapshotJson: string
  reason?: string
  updatedBy?: string
  createdAt: number
}

export function RevisionDrawerClient({
  entityId,
  entityType,
  onRestored,
}: {
  entityId: string
  entityType: 'page' | 'blog_post'
  onRestored?: () => void
}) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [loading, setLoading] = useState(false)
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const fetchRevisions = async () => {
    if (!entityId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/revisions/${entityType}/${entityId}`)
      if (res.ok) {
        const data = await res.json()
        setRevisions(data.data || [])
      }
    } catch {
      // ignore error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchRevisions()
    }
  }, [isOpen, entityId])

  const handleRestore = async (rev: Revision) => {
    if (!confirm(`Are you sure you want to restore the version from ${new Date(rev.createdAt).toLocaleString()}? Current live edits will be backed up.`)) {
      return
    }

    setRestoringId(rev.id)
    try {
      const res = await fetch(`/api/admin/revisions/${rev.id}/restore`, {
        method: 'POST',
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to restore revision')
      }

      toast({
        title: 'Version Restored',
        description: `Successfully restored version "${rev.title}".`,
      })

      if (onRestored) {
        onRestored()
      } else {
        window.location.reload()
      }
    } catch (err: any) {
      toast({
        title: 'Restore Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border-border bg-card text-brand-primary hover:bg-muted font-medium text-xs shadow-sm"
      >
        <History className="h-3.5 w-3.5" /> Version History
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-card shadow-2xl border-l border-border flex flex-col">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <History className="h-5 w-5 text-brand-primary" />
                  <div>
                    <h2 className="font-heading font-bold text-base text-foreground">Content Rollbacks</h2>
                    <p className="text-xs text-brand-muted">Restore past snapshots safely.</p>
                  </div>
                </div>
                <button
                  type="button"
                  title="Close drawer"
                  aria-label="Close drawer"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-brand-muted hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <div className="py-12 text-center text-xs text-brand-muted">Loading version snapshots...</div>
                ) : revisions.length === 0 ? (
                  <div className="py-12 text-center rounded-xl border border-dashed border-border p-6">
                    <AlertCircle className="mx-auto h-8 w-8 text-brand-muted opacity-40 mb-2" />
                    <p className="text-xs font-semibold text-foreground">No historical versions recorded yet</p>
                    <p className="text-[11px] text-brand-muted mt-1">
                      Whenever content edits are made, historical backups will appear here for 1-click restoration.
                    </p>
                  </div>
                ) : (
                  revisions.map((rev) => (
                    <div key={rev.id} className="rounded-xl border border-border bg-background p-4 shadow-sm hover:border-brand-primary/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                          <Clock className="h-3.5 w-3.5 text-brand-primary" />
                          {new Date(rev.createdAt).toLocaleDateString()} {new Date(rev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          {rev.updatedBy || 'Staff'}
                        </span>
                      </div>

                      <div className="mt-2 text-xs font-medium text-foreground">{rev.title}</div>
                      {rev.reason && <div className="mt-1 text-[11px] text-brand-muted italic">{rev.reason}</div>}

                      <div className="mt-3 pt-3 border-t border-border flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={restoringId === rev.id}
                          onClick={() => handleRestore(rev)}
                          className="h-7 text-[11px] flex items-center gap-1 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                        >
                          <RotateCcw className="h-3 w-3" /> {restoringId === rev.id ? 'Restoring...' : 'Restore This Version'}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-border bg-muted/30 text-center">
                <p className="text-[11px] text-brand-muted">
                  Restoring automatically snapshots your current live content first so nothing is permanently lost.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
