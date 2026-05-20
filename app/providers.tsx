'use client'

import { SessionProvider } from 'next-auth/react'
import { OfflineSyncProvider } from '@/components/public/shared/OfflineSyncProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <OfflineSyncProvider>
        {children}
      </OfflineSyncProvider>
    </SessionProvider>
  )
}


