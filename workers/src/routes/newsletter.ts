import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc } from 'drizzle-orm'
import { createDb } from '../db/client'
import { newsletterSubscribers } from '../../../lib/db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'
import { rateLimit } from '../middleware/rateLimit'

type Bindings = {
  DB: D1Database
}

export const newsletterRoutes = new Hono<{ Bindings: Bindings }>()

const subscriberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  preferencesJson: z.string().optional(),
})

// POST /api/newsletter/subscribe - Public subscription
newsletterRoutes.post('/subscribe', rateLimit({ windowMs: 600000, maxRequests: 5, endpointLabel: 'newsletter subscription' }), async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const parsed = subscriberSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)

  // Check if already exists
  const existing = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, parsed.data.email)).limit(1)

  if (existing.length) {
    if (existing[0].status === 'active') {
      return c.json({ message: 'Already subscribed' }, 200)
    } else {
      // Re-activate
      await db.update(newsletterSubscribers)
        .set({ status: 'active', updatedAt: new Date() })
        .where(eq(newsletterSubscribers.email, parsed.data.email))
      return c.json({ success: true, message: 'Subscription re-activated' }, 200)
    }
  }

  const id = nanoid()
  const newSubscriber = {
    id,
    ...parsed.data,
    status: 'active' as const,
    subscribedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  try {
    await db.insert(newsletterSubscribers).values(newSubscriber)
    return c.json({ success: true, id }, 201)
  } catch (err) {
    console.error('Failed to save subscriber:', err)
    return c.json({ error: 'Database error' }, 500)
  }
})

// GET /api/newsletter/unsubscribe - Public unsubscription (one-click)
newsletterRoutes.get('/unsubscribe', async (c) => {
  const email = c.req.query('email')
  if (!email) return c.json({ error: 'Email required' }, 400)

  const db = createDb(c.env.DB)
  const result = await db.update(newsletterSubscribers)
    .set({ status: 'unsubscribed', unsubscribedAt: new Date(), updatedAt: new Date() })
    .where(eq(newsletterSubscribers.email, email))
    .returning()

  if (!result.length) {
    return c.json({ error: 'Subscriber not found' }, 404)
  }

  return c.json({ success: true, message: 'Unsubscribed successfully' })
})

// Protected routes for Admin
newsletterRoutes.use('*', authMiddleware)

// GET /api/newsletter/subscribers - List subscribers
newsletterRoutes.get('/subscribers', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const db = createDb(c.env.DB)
  const results = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt)).limit(1000)
  return c.json({ data: results })
})
