import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, asc, isNull } from 'drizzle-orm'
import { createDb } from '../db/client'
import { teamMembers } from '../../../lib/db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'

type Bindings = {
  DB: D1Database
}

export const teamRoutes = new Hono<{ Bindings: Bindings; Variables: { user: any } }>()

const teamMemberSchema = z.object({
  name: z.string().min(1).max(255),
  role: z.string().min(1).max(255),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  category: z.enum(['executive', 'board', 'volunteer_lead']).default('executive'),
  orderIndex: z.number().int().default(0),
})

// GET /api/team (Public list)
teamRoutes.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const category = c.req.query('category')

  let query = db
    .select()
    .from(teamMembers)
    .where(isNull(teamMembers.deletedAt))
    .$dynamic()

  if (category && ['executive', 'board', 'volunteer_lead'].includes(category)) {
    query = query.where(eq(teamMembers.category, category as any))
  }

  const result = await query.orderBy(asc(teamMembers.orderIndex), asc(teamMembers.name))
  return c.json({ ok: true, data: result })
})

// GET /api/team/:id
teamRoutes.get('/:id', async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id') || ''

  const result = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1)

  if (!result.length || result[0].deletedAt) {
    return c.json({ error: 'Team member not found' }, 404)
  }

  return c.json({ ok: true, data: result[0] })
})

// POST /api/admin/team
teamRoutes.post('/', authMiddleware, requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const parsed = teamMemberSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const id = nanoid()
  const now = new Date()

  const newMember = {
    id,
    name: parsed.data.name,
    role: parsed.data.role,
    bio: parsed.data.bio || null,
    photoUrl: parsed.data.photoUrl || null,
    category: parsed.data.category,
    orderIndex: parsed.data.orderIndex,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }

  await db.insert(teamMembers).values(newMember)
  return c.json({ ok: true, data: newMember }, 201)
})

// PUT /api/admin/team/:id
teamRoutes.put('/:id', authMiddleware, requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const id = c.req.param('id') || ''
  const body = await c.req.json().catch(() => ({}))
  const parsed = teamMemberSchema.partial().safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const existing = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1)

  if (!existing.length || existing[0].deletedAt) {
    return c.json({ error: 'Team member not found' }, 404)
  }

  const updated = {
    ...parsed.data,
    updatedAt: new Date(),
  }

  await db.update(teamMembers).set(updated).where(eq(teamMembers.id, id))

  return c.json({ ok: true, data: { ...existing[0], ...updated } })
})

// DELETE /api/admin/team/:id (Soft delete)
teamRoutes.delete('/:id', authMiddleware, requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id') || ''
  const db = createDb(c.env.DB)

  const existing = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1)

  if (!existing.length || existing[0].deletedAt) {
    return c.json({ error: 'Team member not found' }, 404)
  }

  await db
    .update(teamMembers)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(teamMembers.id, id))

  return c.json({ ok: true, message: 'Team member removed' })
})
