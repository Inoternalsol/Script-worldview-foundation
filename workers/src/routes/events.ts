import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc } from 'drizzle-orm'
import { createDb } from '../db/client'
import { events } from '../db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'

type Bindings = {
  DB: D1Database
  ENVIRONMENT: string
}

export const eventsRoutes = new Hono<{ Bindings: Bindings }>()

const eventSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  date: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  description: z.string().min(1),
  capacity: z.number().int().min(1).optional(),
  featuredImage: z.string().url().optional(),
  speakersJson: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'past', 'cancelled']).default('upcoming'),
})

// GET /api/events
eventsRoutes.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const status = c.req.query('status')
  
  let conditions = undefined
  if (status) {
    conditions = eq(events.status, status as any)
  }

  const allEvents = await db
    .select()
    .from(events)
    .where(conditions)
    .orderBy(desc(events.date))
    .limit(50)

  return c.json({ data: allEvents })
})

// GET /api/events/:slug
eventsRoutes.get('/:slug', async (c) => {
  const db = createDb(c.env.DB)
  const slug = c.req.param('slug')

  const eventList = await db.select().from(events).where(eq(events.slug, slug)).limit(1)

  if (!eventList.length) {
    return c.json({ error: 'Event not found' }, 404)
  }

  return c.json({ data: eventList[0] })
})

// Protected routes
eventsRoutes.use('*', authMiddleware)

// POST /api/events
eventsRoutes.post('/', requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const parsed = eventSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const user = c.get('user')

  const newEvent = {
    id: nanoid(),
    ...parsed.data,
    createdBy: user.id,
  }

  try {
    await db.insert(events).values(newEvent)
    return c.json({ data: newEvent }, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return c.json({ error: 'Slug already exists' }, 409)
    }
    return c.json({ error: 'Database error' }, 500)
  }
})

// PUT /api/events/:id
eventsRoutes.put('/:id', requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const id = c.req.param('id')
  const parsed = eventSchema.partial().safeParse(await c.req.json().catch(() => null))
  
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  
  const updateData = {
    ...parsed.data,
    updatedAt: new Date(),
  }

  const result = await db.update(events).set(updateData).where(eq(events.id, id)).returning()

  if (!result.length) {
    return c.json({ error: 'Event not found' }, 404)
  }

  return c.json({ data: result[0] })
})

// DELETE /api/events/:id
eventsRoutes.delete('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)

  // Hard delete for events, or could soft delete if we change schema
  // We'll just hard delete for now
  const result = await db.delete(events).where(eq(events.id, id)).returning()

  if (!result.length) {
    return c.json({ error: 'Event not found' }, 404)
  }

  return c.json({ success: true })
})
