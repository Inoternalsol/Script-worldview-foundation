import { getServerEnv } from '@/lib/env'
import { auth } from '@/auth'

export async function adminFetch(path: string, options?: RequestInit) {
  const env = getServerEnv()
  const url = `${env.NEXT_PUBLIC_API_URL}/api/admin${path}`
  
  const session = await auth()
  const headers = new Headers(options?.headers || {})
  headers.set('Content-Type', 'application/json')
  
  if (session?.user && (session.user as any).backendToken) {
    headers.set('Authorization', `Bearer ${(session.user as any).backendToken}`)
  }
  
  const res = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => 'Unknown error')
    throw new Error(`Admin API error ${res.status}: ${errorBody}`)
  }

  return res.json()
}
