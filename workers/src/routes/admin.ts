import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc, sql, count, and } from 'drizzle-orm'
import { createDb } from '../db/client'
import {
  volunteers,
  donations,
  contacts,
  newsletterSubscribers,
  blogPosts,
  events,
  eventRegistrations,
  jobPostings,
  jobApplications,
  campaigns,
} from '../db/schema'
import { Env } from '../types'
import { authMiddleware } from '../middleware/auth'

export const adminRoutes = new Hono<{ Bindings: Env }>()

// Enforce authentication on all admin endpoints (Phase 9)
adminRoutes.use('*', authMiddleware)

// ─── Dashboard Stats ──────────────────────────────────────────────
adminRoutes.get('/stats', async (c) => {
  const db = createDb(c.env.DB)

  const [volunteerCount] = await db.select({ count: count() }).from(volunteers)
  const [donationCount] = await db.select({ count: count() }).from(donations)
  const [contactCount] = await db.select({ count: count() }).from(contacts)
  const [subscriberCount] = await db.select({ count: count() }).from(newsletterSubscribers)
  const [blogCount] = await db.select({ count: count() }).from(blogPosts)
  const [eventCount] = await db.select({ count: count() }).from(events)
  const [jobCount] = await db.select({ count: count() }).from(jobPostings)
  const [applicationCount] = await db.select({ count: count() }).from(jobApplications)

  // Sum of completed donations
  const [donationTotal] = await db
    .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
    .from(donations)
    .where(eq(donations.status, 'completed'))

  // Pending counts
  const [pendingVolunteers] = await db
    .select({ count: count() })
    .from(volunteers)
    .where(eq(volunteers.status, 'pending'))

  const [newContacts] = await db
    .select({ count: count() })
    .from(contacts)
    .where(eq(contacts.status, 'new'))

  return c.json({
    data: {
      volunteers: volunteerCount.count,
      pendingVolunteers: pendingVolunteers.count,
      donations: donationCount.count,
      donationTotal: donationTotal.total,
      contacts: contactCount.count,
      newContacts: newContacts.count,
      subscribers: subscriberCount.count,
      blogPosts: blogCount.count,
      events: eventCount.count,
      jobs: jobCount.count,
      applications: applicationCount.count,
    },
  })
})

// ─── Volunteers ───────────────────────────────────────────────────
adminRoutes.get('/volunteers', async (c) => {
  const db = createDb(c.env.DB)
  const status = c.req.query('status')

  const conditions = []
  if (status) {
    conditions.push(eq(volunteers.status, status as any))
  }

  const data = await db
    .select()
    .from(volunteers)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(volunteers.appliedAt))
    .limit(200)

  return c.json({ data })
})

adminRoutes.get('/volunteers/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const [vol] = await db.select().from(volunteers).where(eq(volunteers.id, id)).limit(1)
  if (!vol) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: vol })
})

adminRoutes.patch('/volunteers/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => null)
  if (!body?.status) return c.json({ error: 'Status required' }, 400)

  const result = await db
    .update(volunteers)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(volunteers.id, id))
    .returning()

  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

// ─── Donations ────────────────────────────────────────────────────
adminRoutes.get('/donations', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(donations)
    .orderBy(desc(donations.donatedAt))
    .limit(200)

  return c.json({ data })
})

// ─── Contacts ─────────────────────────────────────────────────────
adminRoutes.get('/contacts', async (c) => {
  const db = createDb(c.env.DB)
  const status = c.req.query('status')

  const conditions = []
  if (status) {
    conditions.push(eq(contacts.status, status as any))
  }

  const data = await db
    .select()
    .from(contacts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(contacts.createdAt))
    .limit(200)

  return c.json({ data })
})

adminRoutes.patch('/contacts/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => null)
  if (!body?.status) return c.json({ error: 'Status required' }, 400)

  const result = await db
    .update(contacts)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(contacts.id, id))
    .returning()

  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

// ─── Newsletter ───────────────────────────────────────────────────
adminRoutes.get('/newsletter', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.subscribedAt))
    .limit(200)

  return c.json({ data })
})

// ─── Blog Posts (Admin CRUD) ──────────────────────────────────────
adminRoutes.get('/blog', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt))
    .limit(200)

  return c.json({ data })
})

adminRoutes.get('/blog/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1)
  if (!post) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: post })
})

const blogCreateSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  categoryId: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  readTimeMinutes: z.number().int().min(1).optional(),
})

adminRoutes.post('/blog', async (c) => {
  const parsed = blogCreateSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)

  const db = createDb(c.env.DB)
  const newPost = {
    id: nanoid(),
    ...parsed.data,
    authorId: null,
    publishedAt: parsed.data.status === 'published' ? new Date() : null,
  }

  try {
    await db.insert(blogPosts).values(newPost)
    return c.json({ data: newPost }, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) return c.json({ error: 'Slug already exists' }, 409)
    return c.json({ error: 'Database error', message: err.message }, 500)
  }
})

adminRoutes.patch('/blog/:id', async (c) => {
  const id = c.req.param('id')
  const parsed = blogCreateSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input' }, 400)

  const db = createDb(c.env.DB)
  const updateData = {
    ...parsed.data,
    updatedAt: new Date(),
    ...(parsed.data.status === 'published' ? { publishedAt: new Date() } : {}),
  }

  const result = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

adminRoutes.delete('/blog/:id', async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  const result = await db
    .update(blogPosts)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(blogPosts.id, id))
    .returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ─── Events (Admin CRUD) ─────────────────────────────────────────
adminRoutes.get('/events', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(events)
    .orderBy(desc(events.date))
    .limit(200)

  return c.json({ data })
})

adminRoutes.get('/events/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1)
  if (!event) return c.json({ error: 'Not found' }, 404)

  // Also fetch registrations
  const regs = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, id))
    .orderBy(desc(eventRegistrations.registeredAt))

  return c.json({ data: { ...event, registrations: regs } })
})

const eventCreateSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  date: z.number(),
  endDate: z.number().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  description: z.string().min(1),
  capacity: z.number().int().optional(),
  featuredImage: z.string().optional(),
  speakersJson: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'past', 'cancelled']).default('upcoming'),
})

adminRoutes.post('/events', async (c) => {
  const parsed = eventCreateSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)

  const db = createDb(c.env.DB)
  const newEvent = {
    id: nanoid(),
    ...parsed.data,
    date: new Date(parsed.data.date),
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    registrationsCount: 0,
    createdBy: null,
  }

  try {
    await db.insert(events).values(newEvent)
    return c.json({ data: newEvent }, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) return c.json({ error: 'Slug already exists' }, 409)
    return c.json({ error: 'Database error', message: err.message }, 500)
  }
})

adminRoutes.patch('/events/:id', async (c) => {
  const id = c.req.param('id')
  const parsed = eventCreateSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input' }, 400)

  const db = createDb(c.env.DB)
  const updateData: Record<string, any> = { ...parsed.data, updatedAt: new Date() }
  if (parsed.data.date) updateData.date = new Date(parsed.data.date)
  if (parsed.data.endDate) updateData.endDate = new Date(parsed.data.endDate)

  const result = await db.update(events).set(updateData).where(eq(events.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

// ─── Careers (Admin CRUD) ─────────────────────────────────────────
adminRoutes.get('/careers', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(jobPostings)
    .orderBy(desc(jobPostings.createdAt))
    .limit(200)

  return c.json({ data })
})

adminRoutes.get('/careers/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const [job] = await db.select().from(jobPostings).where(eq(jobPostings.id, id)).limit(1)
  if (!job) return c.json({ error: 'Not found' }, 404)

  const apps = await db
    .select()
    .from(jobApplications)
    .where(eq(jobApplications.jobId, id))
    .orderBy(desc(jobApplications.appliedAt))

  return c.json({ data: { ...job, applications: apps } })
})

const jobCreateSchema = z.object({
  title: z.string().min(1).max(255),
  department: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(['full_time', 'part_time', 'contract', 'volunteer', 'internship']),
  description: z.string().min(1),
  requirements: z.string().optional(),
  deadline: z.number().optional(),
  status: z.enum(['open', 'closed', 'archived']).default('open'),
})

adminRoutes.post('/careers', async (c) => {
  const parsed = jobCreateSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)

  const db = createDb(c.env.DB)
  const newJob = {
    id: nanoid(),
    ...parsed.data,
    deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
    createdBy: null,
  }

  try {
    await db.insert(jobPostings).values(newJob)
    return c.json({ data: newJob }, 201)
  } catch (err: any) {
    return c.json({ error: 'Database error', message: err.message }, 500)
  }
})

adminRoutes.patch('/careers/:id', async (c) => {
  const id = c.req.param('id')
  const parsed = jobCreateSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input' }, 400)

  const db = createDb(c.env.DB)
  const updateData: Record<string, any> = { ...parsed.data, updatedAt: new Date() }
  if (parsed.data.deadline) updateData.deadline = new Date(parsed.data.deadline)

  const result = await db.update(jobPostings).set(updateData).where(eq(jobPostings.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

// ─── Job Applications ─────────────────────────────────────────────
adminRoutes.get('/applications', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(jobApplications)
    .orderBy(desc(jobApplications.appliedAt))
    .limit(200)

  return c.json({ data })
})

adminRoutes.patch('/applications/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => null)
  if (!body?.status) return c.json({ error: 'Status required' }, 400)

  const result = await db
    .update(jobApplications)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(jobApplications.id, id))
    .returning()

  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

// ─── Campaigns ────────────────────────────────────────────────────
adminRoutes.get('/campaigns', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(campaigns)
    .orderBy(desc(campaigns.createdAt))
    .limit(200)

  return c.json({ data })
})
