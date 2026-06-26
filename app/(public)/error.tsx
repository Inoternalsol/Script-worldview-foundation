'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-6">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <h2 className="font-heading text-2xl font-bold text-foreground">
        Something Went Wrong
      </h2>
      <p className="mt-3 max-w-md text-brand-muted">
        We encountered an unexpected error loading this page. This may be a temporary issue — please try again.
      </p>

      {error.digest && (
        <p className="mt-2 font-mono text-xs text-brand-muted/60">
          Error ID: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} variant="cta" className="h-11">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button asChild variant="secondary" className="h-11">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
