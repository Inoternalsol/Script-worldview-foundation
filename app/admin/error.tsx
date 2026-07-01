'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin Panel Runtime Error:', error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-red-100 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
        Something went wrong in the Admin Panel
      </h2>
      <p className="mt-2 max-w-md text-sm text-brand-muted">
        {error.message || 'An unexpected server error occurred while loading this page.'}
      </p>
      <div className="mt-6 flex items-center gap-4">
        <Button onClick={() => reset()} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Link href="/admin/login">
          <Button variant="cta" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign in again
          </Button>
        </Link>
      </div>
    </div>
  )
}
