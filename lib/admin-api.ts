import { getServerEnv } from '@/lib/env'

export async function adminFetch(path: string, options?: RequestInit) {
  const env = getServerEnv()
  const url = `${env.NEXT_PUBLIC_API_URL}/api/admin${path}`
  
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => 'Unknown error')
    throw new Error(`Admin API error ${res.status}: ${errorBody}`)
  }

  return res.json()
}
