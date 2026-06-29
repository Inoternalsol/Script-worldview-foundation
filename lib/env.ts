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
    cachedEnv = serverEnvSchema.parse({
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      JWT_SECRET: process.env.JWT_SECRET,
    })
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

