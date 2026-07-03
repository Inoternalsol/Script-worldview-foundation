import { Skeleton } from '@/components/ui/skeleton'

export function AdminTableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-md bg-muted" />
          <Skeleton className="h-4 w-72 rounded-md bg-muted" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg bg-muted" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64 rounded-md bg-muted" />
          <Skeleton className="h-9 w-24 rounded-md bg-muted" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-md bg-muted" />
          <Skeleton className="h-16 w-full rounded-md bg-muted" />
          <Skeleton className="h-16 w-full rounded-md bg-muted" />
          <Skeleton className="h-16 w-full rounded-md bg-muted" />
          <Skeleton className="h-16 w-full rounded-md bg-muted" />
        </div>
      </div>
    </div>
  )
}
