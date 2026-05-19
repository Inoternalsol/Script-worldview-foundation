import { MiddlewareHandler } from 'hono'

// Simple sliding window in-memory rate tracker
// Maps Client IP address string to an array of request epoch timestamps
const ipRequestHistory = new Map<string, number[]>()

export type RateLimitOptions = {
  windowMs: number // Window duration in milliseconds (e.g. 10 minutes = 600,000ms)
  maxRequests: number // Maximum allowed requests within the window
  endpointLabel?: string // Visual identifier for the blocked resource
}

export function rateLimit(options: RateLimitOptions): MiddlewareHandler {
  const { windowMs, maxRequests, endpointLabel = 'API endpoint' } = options

  return async (c, next) => {
    // 1. Identify Client IP
    const clientIp = 
      c.req.header('CF-Connecting-IP') || 
      c.req.header('X-Real-IP') || 
      c.req.header('X-Forwarded-For')?.split(',')[0].trim() || 
      '127.0.0.1'

    const now = Date.now()

    // 2. Fetch history and clean up expired request timestamps
    let timestamps = ipRequestHistory.get(clientIp) || []
    timestamps = timestamps.filter((time) => now - time < windowMs)

    // 3. Check threshold limits
    if (timestamps.length >= maxRequests) {
      const remainingMs = windowMs - (now - timestamps[0])
      const remainingMinutes = Math.ceil(remainingMs / 60000)

      return c.json(
        {
          error: 'Too Many Requests',
          message: `You have exceeded the allowed limit of ${maxRequests} requests for this ${endpointLabel}. Please try again in ${remainingMinutes} minute(s).`,
          retryAfterMs: remainingMs,
        },
        429,
        {
          'Retry-After': String(Math.ceil(remainingMs / 1000)),
        }
      )
    }

    // 4. Record current request timestamp and save to history
    timestamps.push(now)
    ipRequestHistory.set(clientIp, timestamps)

    await next()
  }
}
