'use client'

import { SessionProvider } from 'next-auth/react'
import { OfflineSyncProvider } from '@/components/public/shared/OfflineSyncProvider'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <OfflineSyncProvider>
          {children}
        </OfflineSyncProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}


