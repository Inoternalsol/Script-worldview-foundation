import { z } from 'zod'
import { SignJWT } from 'jose'

const serverEnvSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1).default('fallback-nextauth-secret'),
  NEXTAUTH_URL: z.string().optional(),
  NEXT_PUBLIC_API_URL: z.string().min(1).default('http://localhost:8787'),
  NEXT_PUBLIC_APP_URL: z.string().min(1).default('http://localhost:3000'),
  JWT_SECRET: z.string().min(1).default('development_jwt_secret_key_12345'),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: ServerEnv | null = null

export function getServerEnv(): ServerEnv {
  if (!cachedEnv) {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || undefined
    if (process.env.NODE_ENV === 'production' && (!apiUrl || apiUrl.includes('localhost') || apiUrl.includes('swf.vercel.app'))) {
      apiUrl = 'https://script-worldview-api.scriptworldview-dev.workers.dev'
    }

    const raw = {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || undefined,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || undefined,
      NEXT_PUBLIC_API_URL: apiUrl,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
      JWT_SECRET: process.env.JWT_SECRET || undefined,
    }
    const parsed = serverEnvSchema.safeParse(raw)
    if (parsed.success) {
      cachedEnv = parsed.data
    } else {
      cachedEnv = {
        NEXTAUTH_SECRET: raw.NEXTAUTH_SECRET || 'fallback-nextauth-secret',
        NEXTAUTH_URL: raw.NEXTAUTH_URL,
        NEXT_PUBLIC_API_URL: raw.NEXT_PUBLIC_API_URL || 'https://script-worldview-api.scriptworldview-dev.workers.dev',
        NEXT_PUBLIC_APP_URL: raw.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        JWT_SECRET: raw.JWT_SECRET || 'development_jwt_secret_key_12345',
      }
    }
    if (cachedEnv.NEXT_PUBLIC_API_URL) {
      cachedEnv.NEXT_PUBLIC_API_URL = cachedEnv.NEXT_PUBLIC_API_URL.replace(/\/+$/, '').replace(/\/api$/, '')
    }
  }
  return cachedEnv
}

export interface BackendTokenPayload {
  sub: string
  role?: string
  department?: string | null
}

export async function signBackendToken(payload: BackendTokenPayload, expiresIn = '30d'): Promise<string> {
  const env = getServerEnv()
  const secretKey = new TextEncoder().encode(env.JWT_SECRET)

  return new SignJWT({
    sub: payload.sub,
    role: payload.role || 'viewer',
    department: payload.department || null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey)
}

