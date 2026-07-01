import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc, isNull } from 'drizzle-orm'
import { createDb } from '../db/client'
import { transparencyDocuments } from '../../../lib/db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'

type Bindings = {
  DB: D1Database
}

export const transparencyRoutes = new Hono<{ Bindings: Bindings; Variables: { user: any } }>()

const docSchema = z.object({
  title: z.string().min(1).max(255),
  category: z.enum(['financial_audit', 'annual_report', 'legal_certificate', 'impact_report']),
  fileUrl: z.string().min(1),
  fileSize: z.string().optional(),
  year: z.number().int().min(1990).max(2100),
  description: z.string().optional(),
})

// GET /api/transparency (Public list)
transparencyRoutes.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const category = c.req.query('category')

  let query = db
    .select()
    .from(transparencyDocuments)
    .where(isNull(transparencyDocuments.deletedAt))
    .$dynamic()

  if (category && ['financial_audit', 'annual_report', 'legal_certificate', 'impact_report'].includes(category)) {
    query = query.where(eq(transparencyDocuments.category, category as any))
  }

  const result = await query.orderBy(desc(transparencyDocuments.year), desc(transparencyDocuments.createdAt))
  return c.json({ ok: true, data: result })
})

// GET /api/transparency/:id
transparencyRoutes.get('/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id') || ''

  const result = await db
    .select()
    .from(transparencyDocuments)
    .where(eq(transparencyDocuments.id, id))
    .limit(1)

  if (!result.length || result[0].deletedAt) {
    return c.json({ error: 'Document not found' }, 404)
  }

  return c.json({ ok: true, data: result[0] })
})

// POST /api/admin/transparency
transparencyRoutes.post('/', authMiddleware, requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const parsed = docSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const id = nanoid()
  const now = new Date()

  const newDoc = {
    id,
    title: parsed.data.title,
    category: parsed.data.category,
    fileUrl: parsed.data.fileUrl,
    fileSize: parsed.data.fileSize || '2.4 MB',
    year: parsed.data.year,
    description: parsed.data.description || null,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }

  await db.insert(transparencyDocuments).values(newDoc)
  return c.json({ ok: true, data: newDoc }, 201)
})

// PUT /api/admin/transparency/:id
transparencyRoutes.put('/:id', authMiddleware, requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const id = c.req.param('id') || ''
  const body = await c.req.json().catch(() => ({}))
  const parsed = docSchema.partial().safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const existing = await db.select().from(transparencyDocuments).where(eq(transparencyDocuments.id, id)).limit(1)

  if (!existing.length || existing[0].deletedAt) {
    return c.json({ error: 'Document not found' }, 404)
  }

  const updated = {
    ...parsed.data,
    updatedAt: new Date(),
  }

  await db.update(transparencyDocuments).set(updated).where(eq(transparencyDocuments.id, id))

  return c.json({ ok: true, data: { ...existing[0], ...updated } })
})

// DELETE /api/admin/transparency/:id
transparencyRoutes.delete('/:id', authMiddleware, requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id') || ''
  const db = createDb(c.env.DB)

  const existing = await db.select().from(transparencyDocuments).where(eq(transparencyDocuments.id, id)).limit(1)

  if (!existing.length || existing[0].deletedAt) {
    return c.json({ error: 'Document not found' }, 404)
  }

  await db
    .update(transparencyDocuments)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(transparencyDocuments.id, id))

  return c.json({ ok: true, message: 'Document removed' })
})
