import { Context, Next } from 'hono'
import { Env } from '../types'

const WINDOW_SIZE_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 30 // 30 requests per minute

export const rateLimitMiddleware = async (c: Context<{ Bindings: Env }>, next: Next) => {
  const method = c.req.method
  // Only rate limit mutating methods
  if (['GET', 'OPTIONS', 'HEAD'].includes(method)) {
    return next()
  }

  // Check if KV is bound
  if (!c.env.RATE_LIMITER_KV) {
    return next()
  }

  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
  if (ip === 'unknown') {
    return next()
  }

  const key = `ratelimit:${ip}`
  const now = Date.now()

  try {
    const rawData = await c.env.RATE_LIMITER_KV.get(key)
    
    let count = 1
    let expiresAt = now + WINDOW_SIZE_MS

    if (rawData) {
      const data = JSON.parse(rawData) as { count: number; expiresAt: number }
      
      // Check if window expired
      if (now < data.expiresAt) {
        count = data.count + 1
        expiresAt = data.expiresAt
      }
    }

    if (count > MAX_REQUESTS) {
      return c.json({ success: false, error: 'Too many requests. Please try again later.' }, 429)
    }

    // Write back to KV
    // TTL is in seconds. We use expirationTtl to ensure KV cleans it up automatically
    const ttlSeconds = Math.max(60, Math.ceil((expiresAt - now) / 1000))
    await c.env.RATE_LIMITER_KV.put(key, JSON.stringify({ count, expiresAt }), {
      expirationTtl: ttlSeconds
    })
  } catch (error) {
    console.error('Rate Limiter Error:', error)
    // Fail open if KV fails
  }

  return next()
}
