import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc, and, isNull } from 'drizzle-orm'
import { createDb } from '../db/client'
import { volunteers } from '../../../lib/db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'
import { sendEmail } from '../utils/email'
import { getVolunteerAcknowledgmentHtml } from '../utils/email-templates'

import { rateLimit } from '../middleware/rateLimit'

type Bindings = {
  DB: D1Database
  RESEND_API_KEY: string
  EMAIL_FROM: string
}

export const volunteerRoutes = new Hono<{ Bindings: Bindings }>()

const volunteerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  skillsJson: z.string().optional(), // Expecting stringified array
  availabilityJson: z.string().optional(), // Expecting stringified object
  languages: z.string().optional(),
  motivation: z.string().optional(),
  howDidYouHear: z.string().optional(),
})

// POST /api/volunteers - Public submission
volunteerRoutes.post('/', rateLimit({ windowMs: 600000, maxRequests: 10, endpointLabel: 'volunteer application submission' }), async (c) => {
  const body = await c.req.json().catch(() => ({}))
  if (body._honeypot || (typeof body.website === 'string' && body.website.trim().length > 0)) {
    return c.json({ success: true, id: nanoid() }, 201)
  }
  const parsed = volunteerSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const id = nanoid()

  const newVolunteer = {
    id,
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    phone: parsed.data.phone || null,
    location: parsed.data.location || null,
    skillsJson: parsed.data.skillsJson || null,
    availabilityJson: parsed.data.availabilityJson || null,
    languages: parsed.data.languages || null,
    motivation: parsed.data.motivation || null,
    howDidYouHear: parsed.data.howDidYouHear || null,
    status: 'pending' as const,
    appliedAt: new Date(),
  }

  try {
    await db.insert(volunteers).values(newVolunteer)

    // Trigger Volunteer Acknowledgment Email (Phase 7)
    const emailHtml = getVolunteerAcknowledgmentHtml(parsed.data.name)
    await sendEmail(c.env, {
      to: parsed.data.email,
      subject: 'Volunteer Application Received - Script Worldview Foundation',
      html: emailHtml,
    })

    return c.json({ success: true, id }, 201)
  } catch (err: any) {
    console.error('Failed to save volunteer:', err)
    
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Conflict', message: 'An application with this email already exists.' }, 409)
    }

    return c.json({ error: 'Database error', message: err.message }, 500)
  }
})

// Protected routes for Admin
volunteerRoutes.use('*', authMiddleware)

// GET /api/volunteers - List applications (excluding soft-deleted)
volunteerRoutes.get('/', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const db = createDb(c.env.DB)
  const results = await db.select()
    .from(volunteers)
    .where(isNull(volunteers.deletedAt))
    .orderBy(desc(volunteers.appliedAt))
    .limit(100)
  return c.json({ data: results })
})

// GET /api/volunteers/:id - Single application (excluding soft-deleted)
volunteerRoutes.get('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  const result = await db.select()
    .from(volunteers)
    .where(and(eq(volunteers.id, id!), isNull(volunteers.deletedAt)))
    .limit(1)

  if (!result.length) {
    return c.json({ error: 'Volunteer not found' }, 404)
  }

  return c.json({ data: result[0] })
})

// PUT /api/volunteers/:id - Update status (excluding soft-deleted)
volunteerRoutes.put('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => ({}))
  
  const updateSchema = z.object({
    status: z.enum(['pending', 'approved', 'active', 'rejected']).optional(),
  })

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const db = createDb(c.env.DB)
  const result = await db.update(volunteers)
    .set({ 
      ...parsed.data, 
      updatedAt: new Date() 
    })
    .where(and(eq(volunteers.id, id!), isNull(volunteers.deletedAt)))
    .returning()

  if (!result.length) {
    return c.json({ error: 'Volunteer not found' }, 404)
  }

  return c.json({ data: result[0] })
})

// DELETE /api/volunteers/:id - Soft delete
volunteerRoutes.delete('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  
  const result = await db.update(volunteers)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date()
    })
    .where(and(eq(volunteers.id, id!), isNull(volunteers.deletedAt)))
    .returning()

  if (!result.length) {
    return c.json({ error: 'Volunteer not found or already deleted' }, 404)
  }

  return c.json({ ok: true, data: result[0] })
})

