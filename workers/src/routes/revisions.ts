import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc, and } from 'drizzle-orm'
import { createDb } from '../db/client'
import { contentRevisions, pages, blogPosts } from '../../../lib/db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'

type Bindings = {
  DB: D1Database
}

export const revisionRoutes = new Hono<{ Bindings: Bindings; Variables: { user: any } }>()

const snapshotSchema = z.object({
  entityId: z.string().min(1),
  entityType: z.enum(['page', 'blog_post']),
  title: z.string().min(1),
  snapshotJson: z.string().min(2),
  reason: z.string().optional(),
})

// GET /api/admin/revisions/:entityType/:entityId
revisionRoutes.get('/:entityType/:entityId', authMiddleware, async (c) => {
  const db = createDb(c.env.DB)
  const entityType = c.req.param('entityType') as 'page' | 'blog_post'
  const entityId = c.req.param('entityId') || ''

  if (!['page', 'blog_post'].includes(entityType)) {
    return c.json({ error: 'Invalid entity type' }, 400)
  }

  const result = await db
    .select()
    .from(contentRevisions)
    .where(and(eq(contentRevisions.entityId, entityId), eq(contentRevisions.entityType, entityType)))
    .orderBy(desc(contentRevisions.createdAt))
    .limit(30)

  return c.json({ ok: true, data: result })
})

// POST /api/admin/revisions
revisionRoutes.post('/', authMiddleware, requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const parsed = snapshotSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const user = c.get('user')
  const id = nanoid()
  const now = new Date()

  const newRevision = {
    id,
    entityId: parsed.data.entityId,
    entityType: parsed.data.entityType,
    title: parsed.data.title,
    snapshotJson: parsed.data.snapshotJson,
    reason: parsed.data.reason || 'Manual snapshot prior to edit',
    updatedBy: user?.email || user?.id || 'System Staff',
    createdAt: now,
  }

  await db.insert(contentRevisions).values(newRevision)
  return c.json({ ok: true, data: newRevision }, 201)
})

// POST /api/admin/revisions/:id/restore
revisionRoutes.post('/:id/restore', authMiddleware, requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const db = createDb(c.env.DB)
  const id = c.req.param('id') || ''
  const user = c.get('user')

  const rev = await db.select().from(contentRevisions).where(eq(contentRevisions.id, id)).limit(1)
  if (!rev.length) {
    return c.json({ error: 'Revision not found' }, 404)
  }

  const revision = rev[0]
  let snapshot: any = {}
  try {
    snapshot = JSON.parse(revision.snapshotJson)
  } catch (err) {
    return c.json({ error: 'Corrupted revision snapshot data' }, 500)
  }

  // Before overwriting, create a backup snapshot of the current state
  if (revision.entityType === 'page') {
    const current = await db.select().from(pages).where(eq(pages.id, revision.entityId)).limit(1)
    if (current.length) {
      await db.insert(contentRevisions).values({
        id: nanoid(),
        entityId: revision.entityId,
        entityType: 'page',
        title: current[0].title,
        snapshotJson: JSON.stringify({
          title: current[0].title,
          contentJson: current[0].contentJson,
          metaTitle: current[0].metaTitle,
          metaDesc: current[0].metaDesc,
        }),
        reason: `Auto backup before restoring revision ${id.substring(0, 7)}`,
        updatedBy: user?.email || 'System Staff',
        createdAt: new Date(),
      })

      const updateData: any = {
        updatedAt: new Date(),
      }
      if (snapshot.title) updateData.title = snapshot.title
      if (snapshot.contentJson) updateData.contentJson = typeof snapshot.contentJson === 'string' ? snapshot.contentJson : JSON.stringify(snapshot.contentJson)
      if (snapshot.metaTitle !== undefined) updateData.metaTitle = snapshot.metaTitle
      if (snapshot.metaDesc !== undefined) updateData.metaDesc = snapshot.metaDesc

      await db.update(pages).set(updateData).where(eq(pages.id, revision.entityId))
    }
  } else if (revision.entityType === 'blog_post') {
    const current = await db.select().from(blogPosts).where(eq(blogPosts.id, revision.entityId)).limit(1)
    if (current.length) {
      await db.insert(contentRevisions).values({
        id: nanoid(),
        entityId: revision.entityId,
        entityType: 'blog_post',
        title: current[0].title,
        snapshotJson: JSON.stringify({
          title: current[0].title,
          content: current[0].content,
          excerpt: current[0].excerpt,
        }),
        reason: `Auto backup before restoring revision ${id.substring(0, 7)}`,
        updatedBy: user?.email || 'System Staff',
        createdAt: new Date(),
      })

      const updateData: any = {
        updatedAt: new Date(),
      }
      if (snapshot.title) updateData.title = snapshot.title
      if (snapshot.content) updateData.content = snapshot.content
      if (snapshot.excerpt !== undefined) updateData.excerpt = snapshot.excerpt

      await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, revision.entityId))
    }
  }

  return c.json({ ok: true, message: 'Revision successfully restored to active live state' })
})
