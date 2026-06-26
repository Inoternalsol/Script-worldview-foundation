'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  )
}
