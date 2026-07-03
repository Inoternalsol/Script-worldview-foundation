import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-72 rounded bg-gray-200/70 dark:bg-gray-800/70" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-800" />
            </CardHeader>
            <CardContent>
              <div className="h-7 w-16 rounded bg-gray-300 dark:bg-gray-700 mt-1" />
              <div className="h-3 w-32 rounded bg-gray-200/70 dark:bg-gray-800/70 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table / Content Skeleton */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-9 w-64 rounded-lg bg-gray-200 dark:bg-gray-800" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="flex items-center justify-between p-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-24 rounded bg-gray-200/70 dark:bg-gray-800/70" />
                  </div>
                </div>
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800 hidden sm:block" />
                <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-800 hidden md:block" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
