import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc, and, isNull } from 'drizzle-orm'
import { createDb } from '../db/client'
import { contacts } from '../../../lib/db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'
import { sendEmail } from '../utils/email'
import { getContactConfirmationHtml, getContactAdminNotificationHtml } from '../utils/email-templates'
import { sendSms } from '../utils/sms'

import { rateLimit } from '../middleware/rateLimit'

type Bindings = {
  DB: D1Database
  RESEND_API_KEY: string
  EMAIL_FROM: string
  SMS_GATEWAY?: string
  TERMII_API_KEY?: string
  TERMII_SENDER_ID?: string
  TWILIO_ACCOUNT_SID?: string
  TWILIO_AUTH_TOKEN?: string
  TWILIO_FROM_NUMBER?: string
  EMERGENCY_COORDINATOR_PHONE?: string
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
  // Silent Honeypot check: instantly return 201 if spam bot filled out hidden fields
  if (body._honeypot || (typeof body.website === 'string' && body.website.trim().length > 0)) {
    return c.json({ success: true, id: nanoid() }, 201)
  }
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
    const adminRecipient = c.env.EMAIL_FROM || 'contact@scriptworldview.org'
    await sendEmail(c.env, {
      to: adminRecipient,
      subject: `New Contact Submission: [${parsed.data.department}] ${parsed.data.subject || 'General inquiry'}`,
      html: adminEmailHtml,
    })

    // 3. Trigger real-time SMS broadcast if it is an urgent humanitarian emergency (Phase 13 recommendation)
    if (parsed.data.type === 'humanitarian' && c.env.EMERGENCY_COORDINATOR_PHONE) {
      const smsMessage = `URGENT RELIEF ALERT: A new humanitarian request has been logged.\nReporter: ${parsed.data.name}\nPhone: ${parsed.data.phone || 'N/A'}\nSubject: ${parsed.data.subject || 'Flood/Displacement relief'}\nReview immediately in your Admin Center.`;
      
      // Fire-and-forget so that it does not block the HTTP client response cycle
      c.executionCtx.waitUntil(
        sendSms(c.env, {
          to: c.env.EMERGENCY_COORDINATOR_PHONE,
          message: smsMessage,
        })
      );
    }
    
    return c.json({ success: true, id }, 201)
  } catch (err) {
    console.error('Failed to save contact:', err)
    return c.json({ error: 'Database error' }, 500)
  }
})

// Protected routes for Admin
contactRoutes.use('*', authMiddleware)

// GET /api/contacts - List submissions (excluding soft-deleted)
contactRoutes.get('/', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const db = createDb(c.env.DB)
  const results = await db.select()
    .from(contacts)
    .where(isNull(contacts.deletedAt))
    .orderBy(desc(contacts.createdAt))
    .limit(100)

  return c.json({ data: results })
})

// GET /api/contacts/:id - Single submission (excluding soft-deleted)
contactRoutes.get('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)

  const result = await db.select()
    .from(contacts)
    .where(and(eq(contacts.id, id!), isNull(contacts.deletedAt)))
    .limit(1)

  if (!result.length) {
    return c.json({ error: 'Contact not found' }, 404)
  }

  return c.json({ data: result[0] })
})

// PUT /api/contacts/:id - Update status/assignment (excluding soft-deleted)
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
    .where(and(eq(contacts.id, id!), isNull(contacts.deletedAt)))
    .returning()

  if (!result.length) {
    return c.json({ error: 'Contact not found' }, 404)
  }

  return c.json({ data: result[0] })
})

// DELETE /api/contacts/:id - Soft delete
contactRoutes.delete('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  
  const result = await db.update(contacts)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date()
    })
    .where(and(eq(contacts.id, id!), isNull(contacts.deletedAt)))
    .returning()

  if (!result.length) {
    return c.json({ error: 'Contact not found or already deleted' }, 404)
  }

  return c.json({ ok: true, data: result[0] })
})

