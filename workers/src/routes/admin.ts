import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc, asc, sql, count, and, isNull } from 'drizzle-orm'
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
  users,
  mediaLibrary,
  auditLogs,
  pages,
  programs,
} from '../../../lib/db/schema'
import { Env } from '../types'
import { authMiddleware } from '../middleware/auth'
import bcrypt from 'bcryptjs'
import { settingsRoutes } from './settings'
import { sendEmail } from '../utils/email'
import { getDonationReceiptHtml } from '../utils/email-templates'

export const adminRoutes = new Hono<{ Bindings: Env }>()

adminRoutes.route('/settings', settingsRoutes)

// Enforce authentication on all admin endpoints (Phase 9)
adminRoutes.use('*', authMiddleware)

// ─── Dashboard Stats ──────────────────────────────────────────────
adminRoutes.get('/stats', async (c) => {
  const db = createDb(c.env.DB)

  const [
    volunteerCountArr,
    donationCountArr,
    contactCountArr,
    subscriberCountArr,
    blogCountArr,
    eventCountArr,
    jobCountArr,
    applicationCountArr,
    donationTotalArr,
    pendingVolunteersArr,
    newContactsArr
  ] = await Promise.all([
    db.select({ count: count() }).from(volunteers),
    db.select({ count: count() }).from(donations).where(isNull(donations.deletedAt)),
    db.select({ count: count() }).from(contacts),
    db.select({ count: count() }).from(newsletterSubscribers),
    db.select({ count: count() }).from(blogPosts),
    db.select({ count: count() }).from(events),
    db.select({ count: count() }).from(jobPostings),
    db.select({ count: count() }).from(jobApplications),
    db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` }).from(donations).where(and(eq(donations.status, 'completed'), isNull(donations.deletedAt))),
    db.select({ count: count() }).from(volunteers).where(eq(volunteers.status, 'pending')),
    db.select({ count: count() }).from(contacts).where(eq(contacts.status, 'new'))
  ])

  return c.json({
    data: {
      volunteers: volunteerCountArr[0].count,
      pendingVolunteers: pendingVolunteersArr[0].count,
      donations: donationCountArr[0].count,
      donationTotal: donationTotalArr[0].total,
      contacts: contactCountArr[0].count,
      newContacts: newContactsArr[0].count,
      subscribers: subscriberCountArr[0].count,
      blogPosts: blogCountArr[0].count,
      events: eventCountArr[0].count,
      jobs: jobCountArr[0].count,
      applications: applicationCountArr[0].count,
    },
  })
})

adminRoutes.get('/analytics', async (c) => {
  const currentYearNum = new Date().getFullYear()
  const startOfYearMs = new Date(`${currentYearNum}-01-01T00:00:00.000Z`).getTime()
  const endOfYearMs = new Date(`${currentYearNum + 1}-01-01T00:00:00.000Z`).getTime()

  const { results: rawDonations } = await c.env.DB.prepare(`
    SELECT 
      strftime('%m', donated_at / 1000, 'unixepoch') as month,
      SUM(amount) as total
    FROM donations
    WHERE status = 'completed' AND deleted_at IS NULL
      AND donated_at >= ? AND donated_at < ?
    GROUP BY month
    ORDER BY month
  `).bind(startOfYearMs, endOfYearMs).all()

  const { results: rawVolunteers } = await c.env.DB.prepare(`
    SELECT 
      strftime('%m', applied_at / 1000, 'unixepoch') as month,
      COUNT(id) as count
    FROM volunteers
    WHERE deleted_at IS NULL
      AND applied_at >= ? AND applied_at < ?
    GROUP BY month
    ORDER BY month
  `).bind(startOfYearMs, endOfYearMs).all()
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const data = monthNames.map((name, index) => {
    const monthStr = (index + 1).toString().padStart(2, '0')
    const donationRow = rawDonations.find((d: any) => d.month === monthStr)
    const volunteerRow = rawVolunteers.find((v: any) => v.month === monthStr)
    
    return {
      name,
      donations: donationRow ? Math.round(Number(donationRow.total) / 100) : 0,
      volunteers: volunteerRow ? Number(volunteerRow.count) : 0,
      pageViews: 0 // Mocked since we do not track it in DB natively
    }
  })

  return c.json({ data })
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
  const record = await db.select().from(volunteers).where(eq(volunteers.id, id)).get()
  
  if (!record) {
    return c.json({ error: 'Volunteer not found' }, 404)
  }
  return c.json({ data: record })
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
adminRoutes.get('/donations/export', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(donations)
    .where(isNull(donations.deletedAt))
    .orderBy(desc(donations.donatedAt))

  const escapeCsv = (val: any) => {
    if (val === null || val === undefined) return ''
    const str = String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const headers = [
    'ID',
    'Donor Name',
    'Donor Email',
    'Donor Phone',
    'Amount',
    'Currency',
    'Campaign ID',
    'Payment Ref',
    'Gateway',
    'Status',
    'Anonymous',
    'Dedication Message',
    'Donated At',
    'Created At',
  ]

  const rows = data.map((d) => [
    d.id,
    d.anonymous ? 'Anonymous' : d.donorName,
    d.donorEmail,
    d.donorPhone || '',
    (d.amount / 100).toFixed(2),
    d.currency,
    d.campaignId || '',
    d.paymentRef,
    d.gateway,
    d.status,
    d.anonymous ? 'true' : 'false',
    d.dedicationMessage || '',
    d.donatedAt ? new Date(d.donatedAt).toISOString() : '',
    d.createdAt ? new Date(d.createdAt).toISOString() : '',
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ].join('\n')

  return c.text(csvContent, 200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename="donations.csv"',
    'Access-Control-Expose-Headers': 'Content-Disposition',
  })
})

adminRoutes.get('/donations', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(donations)
    .where(isNull(donations.deletedAt))
    .orderBy(desc(donations.donatedAt))
    .limit(200)

  return c.json({ data })
})

adminRoutes.post('/donations/:id/receipt', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  
  const [donation] = await db
    .select()
    .from(donations)
    .where(eq(donations.id, id))
    .limit(1)

  if (!donation) return c.json({ error: 'Donation not found' }, 404)
  if (donation.status !== 'completed') return c.json({ error: 'Cannot send receipt for incomplete donation' }, 400)

  const receiptHtml = getDonationReceiptHtml(donation.donorName, donation.amount, donation.currency, donation.id)
  
  const emailResult = await sendEmail(c.env, {
    to: donation.donorEmail,
    subject: 'Receipt: Your Donation to Script Worldview Foundation',
    html: receiptHtml,
  })

  if (!emailResult.success) {
    return c.json({ error: 'Failed to send email', details: emailResult.error }, 500)
  }

  return c.json({ success: true })
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

// ─── Campaigns CRUD Extensions ────────────────────────────────────
const campaignCreateSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  goalAmount: z.number().int().min(1),
  deadline: z.number().optional(),
  description: z.string().min(1),
  featuredImage: z.string().optional(),
  status: z.enum(['active', 'completed', 'paused']).default('active'),
})

adminRoutes.get('/campaigns/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const [camp] = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1)
  if (!camp) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: camp })
})

adminRoutes.post('/campaigns', async (c) => {
  const parsed = campaignCreateSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)

  const db = createDb(c.env.DB)
  const newCampaign = {
    id: nanoid(),
    ...parsed.data,
    deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
    raisedAmount: 0,
    donorCount: 0,
    createdBy: null,
  }

  try {
    await db.insert(campaigns).values(newCampaign)
    return c.json({ data: newCampaign }, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) return c.json({ error: 'Slug already exists' }, 409)
    return c.json({ error: 'Database error', message: err.message }, 500)
  }
})

adminRoutes.patch('/campaigns/:id', async (c) => {
  const id = c.req.param('id')
  const parsed = campaignCreateSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input' }, 400)

  const db = createDb(c.env.DB)
  const updateData: Record<string, any> = { ...parsed.data, updatedAt: new Date() }
  if (parsed.data.deadline) updateData.deadline = new Date(parsed.data.deadline)

  const result = await db.update(campaigns).set(updateData).where(eq(campaigns.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

adminRoutes.delete('/campaigns/:id', async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  const result = await db.delete(campaigns).where(eq(campaigns.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ─── Pages CRUD Extensions ────────────────────────────────────────
const pageCreateSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  contentJson: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  ogImage: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
})

adminRoutes.get('/pages', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db.select().from(pages).orderBy(desc(pages.updatedAt))
  return c.json({ data })
})

adminRoutes.get('/pages/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const [p] = await db.select().from(pages).where(eq(pages.id, id)).limit(1)
  if (!p) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: p })
})

adminRoutes.post('/pages', async (c) => {
  const parsed = pageCreateSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)

  const db = createDb(c.env.DB)
  const newPage = {
    id: nanoid(),
    ...parsed.data,
    authorId: null,
  }

  try {
    await db.insert(pages).values(newPage)
    return c.json({ data: newPage }, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) return c.json({ error: 'Slug already exists' }, 409)
    return c.json({ error: 'Database error', message: err.message }, 500)
  }
})

adminRoutes.patch('/pages/:id', async (c) => {
  const id = c.req.param('id')
  const parsed = pageCreateSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input' }, 400)

  const db = createDb(c.env.DB)
  const result = await db.update(pages).set({ ...parsed.data, updatedAt: new Date() }).where(eq(pages.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

adminRoutes.delete('/pages/:id', async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  const result = await db.delete(pages).where(eq(pages.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ─── Programs (Admin CRUD) ────────────────────────────────────────
const programCreateSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().min(1),
  category: z.enum(['education', 'humanitarian', 'community', 'research', 'capacity']),
  icon: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  sortOrder: z.number().int().default(0),
})

adminRoutes.get('/programs', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db
    .select()
    .from(programs)
    .orderBy(asc(programs.sortOrder), asc(programs.name))
  return c.json({ data })
})

adminRoutes.get('/programs/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const [prog] = await db.select().from(programs).where(eq(programs.id, id)).limit(1)
  if (!prog) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: prog })
})

adminRoutes.post('/programs', async (c) => {
  const parsed = programCreateSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)

  const db = createDb(c.env.DB)
  const newProgram = {
    id: nanoid(),
    ...parsed.data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  try {
    await db.insert(programs).values(newProgram)
    return c.json({ data: newProgram }, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) return c.json({ error: 'Slug already exists' }, 409)
    return c.json({ error: 'Database error', message: err.message }, 500)
  }
})

adminRoutes.patch('/programs/:id', async (c) => {
  const id = c.req.param('id')
  const parsed = programCreateSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input' }, 400)

  const db = createDb(c.env.DB)
  const result = await db.update(programs).set({ ...parsed.data, updatedAt: new Date() }).where(eq(programs.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

adminRoutes.delete('/programs/:id', async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  const result = await db.delete(programs).where(eq(programs.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ─── Users CRUD ───────────────────────────────────────────────────
const userCreateSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  role: z.enum(['super_admin', 'dept_admin', 'content_editor', 'viewer']),
  status: z.enum(['active', 'suspended']).default('active'),
})

adminRoutes.get('/users', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db.select().from(users).orderBy(desc(users.createdAt))
  return c.json({ data })
})

adminRoutes.get('/users/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id')
  const [u] = await db.select().from(users).where(eq(users.id, id)).limit(1)
  if (!u) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: u })
})

adminRoutes.post('/users', async (c) => {
  const parsed = userCreateSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)

  const db = createDb(c.env.DB)
  // Generate a random secure password if not provided
  const password = parsed.data.password || nanoid(12)
  const passwordHash = await bcrypt.hash(password, 12)

  const newUser = {
    id: nanoid(),
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    passwordHash,
    role: parsed.data.role,
    status: parsed.data.status,
    avatarUrl: null,
    lastLogin: null,
  }

  try {
    await db.insert(users).values(newUser)
    return c.json({ data: newUser }, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) return c.json({ error: 'Email already exists' }, 409)
    return c.json({ error: 'Database error', message: err.message }, 500)
  }
})

adminRoutes.patch('/users/:id', async (c) => {
  const id = c.req.param('id')
  const parsed = userCreateSchema.partial().safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input' }, 400)

  const db = createDb(c.env.DB)
  const updateData: Record<string, any> = { ...parsed.data, updatedAt: new Date() }
  if (parsed.data.password) {
    updateData.passwordHash = await bcrypt.hash(parsed.data.password, 12)
    delete updateData.password
  }

  const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: result[0] })
})

adminRoutes.delete('/users/:id', async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  const result = await db.delete(users).where(eq(users.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ─── Media Library CRUD ───────────────────────────────────────────
const mediaCreateSchema = z.object({
  filename: z.string().min(1),
  url: z.string().optional(),
  type: z.enum(['image', 'video', 'document']),
  sizeBytes: z.number().int().optional(),
  altText: z.string().optional(),
  category: z.string().optional(),
})

adminRoutes.get('/media', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db.select().from(mediaLibrary).orderBy(desc(mediaLibrary.createdAt))
  return c.json({ data })
})

adminRoutes.post('/media', async (c) => {
  const parsed = mediaCreateSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)

  const db = createDb(c.env.DB)
  const newMedia = {
    id: nanoid(),
    ...parsed.data,
    url: parsed.data.url || `/images/${parsed.data.filename}`,
    sizeBytes: parsed.data.sizeBytes || 1024,
    tagsJson: '[]',
    uploadedBy: null,
  }

  await db.insert(mediaLibrary).values(newMedia)
  return c.json({ data: newMedia }, 201)
})

adminRoutes.delete('/media/:id', async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  const result = await db.delete(mediaLibrary).where(eq(mediaLibrary.id, id)).returning()
  if (!result.length) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ─── System Audit Logs ────────────────────────────────────────────
adminRoutes.get('/audit-log', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(200)
  return c.json({ data })
})

adminRoutes.get('/audit-logs', async (c) => {
  const db = createDb(c.env.DB)
  const data = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(200)
  return c.json({ data })
})

// ─── Settings ─────────────────────────────────────────────────────
adminRoutes.get('/settings', async (c) => {
  const db = createDb(c.env.DB)
  // Store settings inside pages with slug = '_settings'
  const [p] = await db.select().from(pages).where(eq(pages.slug, '_settings')).limit(1)
  if (!p) {
    // Return default settings
    return c.json({
      data: {
        orgName: 'Script Worldview Foundation',
        contactEmail: 'info@scriptworldviewfoundation.org',
        tagline: 'Shaping Minds. Transforming Communities.',
        maintenanceMode: false,
        emailNotify: true,
      }
    })
  }
  try {
    return c.json({ data: JSON.parse(p.contentJson) })
  } catch {
    return c.json({ error: 'Settings corrupted' }, 500)
  }
})

adminRoutes.post('/settings', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const db = createDb(c.env.DB)
  
  const contentJson = JSON.stringify(body)
  const [existing] = await db.select().from(pages).where(eq(pages.slug, '_settings')).limit(1)
  
  if (existing) {
    await db.update(pages).set({ contentJson, updatedAt: new Date() }).where(eq(pages.slug, '_settings'))
  } else {
    await db.insert(pages).values({
      id: 'settings',
      slug: '_settings',
      title: 'Global Settings',
      contentJson,
      status: 'published',
    })
  }
  return c.json({ success: true, data: body })
})

// ─── Email Dispatcher ─────────────────────────────────────────────
adminRoutes.post('/email/send', async (c) => {
  // Mock sending and log action
  const body = await c.req.json().catch(() => ({}))
  const db = createDb(c.env.DB)
  
  // Log audit log
  await db.insert(auditLogs).values({
    id: nanoid(),
    userId: 'admin',
    action: 'SEND_EMAIL',
    resource: 'email',
    resourceId: body.subject || 'No Subject',
    detailsJson: JSON.stringify({ segment: body.segment }),
  })
  
  return c.json({ success: true })
})
