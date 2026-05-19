import { getServerEnv } from '@/lib/env'
import { auth } from '@/auth'
import { SignJWT } from 'jose'

export async function adminFetch(path: string, options?: RequestInit) {
  const env = getServerEnv()
  const url = `${env.NEXT_PUBLIC_API_URL}/api/admin${path}`
  
  const session = await auth()
  const headers = new Headers(options?.headers || {})
  headers.set('Content-Type', 'application/json')
  
  if (session?.user) {
    const jwtSecret = process.env.JWT_SECRET
    if (jwtSecret) {
      const user = session.user as any
      const secretKey = new TextEncoder().encode(jwtSecret)
      const bearerToken = await new SignJWT({
        sub: user.id || '',
        role: user.role || 'viewer',
        department: user.department || null,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('10m') // 10 minutes short expiry
        .sign(secretKey)
        
      headers.set('Authorization', `Bearer ${bearerToken}`)
    }
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
