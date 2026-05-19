import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc } from 'drizzle-orm'
import { createDb } from '../db/client'
import { contacts } from '../db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'
import { sendEmail } from '../utils/email'
import { getContactConfirmationHtml, getContactAdminNotificationHtml } from '../utils/email-templates'

import { rateLimit } from '../middleware/rateLimit'

type Bindings = {
  DB: D1Database
  RESEND_API_KEY: string
  EMAIL_FROM: string
}

export const contactRoutes = new Hono<{ Bindings: Bindings }>()

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  department: z.enum(['general', 'education', 'humanitarian', 'community', 'hr', 'press', 'partnership']).default('general'),
  message: z.string().min(1),
  type: z.enum(['contact', 'partnership', 'community', 'press', 'humanitarian']).default('contact'),
  source: z.string().optional(),
})

// POST /api/contacts - Public submission
contactRoutes.post('/', rateLimit({ windowMs: 600000, maxRequests: 10, endpointLabel: 'contact form submission' }), async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const id = nanoid()

  const newContact = {
    id,
    ...parsed.data,
    status: 'new' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  try {
    await db.insert(contacts).values(newContact)
    
    // Trigger Email Notification (Phase 7)
    // 1. Send confirmation acknowledgment to the sender
    const userEmailHtml = getContactConfirmationHtml(parsed.data.name)
    await sendEmail(c.env, {
      to: parsed.data.email,
      subject: parsed.data.subject || 'Thank You for Contacting Script Worldview Foundation',
      html: userEmailHtml,
    })

    // 2. Send notification alert to internal department or admin
    const adminEmailHtml = getContactAdminNotificationHtml(parsed.data)
    const adminRecipient = c.env.EMAIL_FROM || 'info@scriptworldviewfoundation.org'
    await sendEmail(c.env, {
      to: adminRecipient,
      subject: `New Contact Submission: [${parsed.data.department}] ${parsed.data.subject || 'General inquiry'}`,
      html: adminEmailHtml,
    })
    
    return c.json({ success: true, id }, 201)
  } catch (err) {
    console.error('Failed to save contact:', err)
    return c.json({ error: 'Database error' }, 500)
  }
})

// Protected routes for Admin
contactRoutes.use('*', authMiddleware)

// GET /api/contacts - List submissions
contactRoutes.get('/', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const db = createDb(c.env.DB)
  const type = c.req.query('type')
  const status = c.req.query('status')

  let query = db.select().from(contacts)
  
  // Basic filtering could be added here if needed
  
  const results = await db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(100)

  return c.json({ data: results })
})

// GET /api/contacts/:id - Single submission
contactRoutes.get('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)

  const result = await db.select().from(contacts).where(eq(contacts.id, id!)).limit(1)

  if (!result.length) {
    return c.json({ error: 'Contact not found' }, 404)
  }

  return c.json({ data: result[0] })
})

// PUT /api/contacts/:id - Update status/assignment
contactRoutes.put('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => ({}))
  
  const updateSchema = z.object({
    status: z.enum(['new', 'in_progress', 'resolved']).optional(),
    assignedTo: z.string().optional(),
  })

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const db = createDb(c.env.DB)
  const result = await db.update(contacts)
    .set({ 
      ...parsed.data, 
      updatedAt: new Date() 
    })
    .where(eq(contacts.id, id!))
    .returning()

  if (!result.length) {
    return c.json({ error: 'Contact not found' }, 404)
  }

  return c.json({ data: result[0] })
})
