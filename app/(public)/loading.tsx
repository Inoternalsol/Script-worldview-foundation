export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-12 md:px-8">
      {/* Page hero skeleton */}
      <div className="mb-12 space-y-4 text-center">
        <div className="mx-auto h-5 w-24 rounded-full bg-secondary/80" />
        <div className="mx-auto h-10 w-96 max-w-full rounded-xl bg-secondary/80" />
        <div className="mx-auto h-5 w-72 max-w-full rounded-lg bg-secondary" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-black/6 bg-card">
            <div className="h-48 bg-secondary/80" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-24 rounded bg-secondary/80" />
              <div className="h-5 w-4/5 rounded bg-secondary/80" />
              <div className="h-4 w-full rounded bg-secondary" />
              <div className="h-4 w-3/4 rounded bg-secondary" />
              <div className="mt-4 h-9 w-28 rounded-lg bg-secondary/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
