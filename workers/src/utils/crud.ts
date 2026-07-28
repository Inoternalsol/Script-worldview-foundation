import { Hono } from 'hono'
import { eq, desc, and, isNull } from 'drizzle-orm'
import { createDb } from '../db/client'
import { Env } from '../types'

export function createCrudHandlers<TTable extends any>(
  router: Hono<{ Bindings: Env }>,
  basePath: string,
  table: TTable,
  sortColumn: any
) {
  // GET all records with optional status filtering
  router.get(basePath, async (c) => {
    const db = createDb(c.env.DB)
    const status = c.req.query('status')
    const conditions = []

    if (status && (table as any).status) {
      conditions.push(eq((table as any).status, status))
    }
    
    // Default ignore deleted records if the table supports soft-deletes
    if ((table as any).deletedAt) {
      conditions.push(isNull((table as any).deletedAt))
    }

    let query = db.select().from(table)
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any
    }

    const data = await query.orderBy(desc(sortColumn)).limit(500)
    return c.json({ data })
  })

  // GET record by ID
  router.get(`${basePath}/:id`, async (c) => {
    const db = createDb(c.env.DB)
    const id = c.req.param('id')
    
    const conditions = [eq((table as any).id, id)]
    if ((table as any).deletedAt) {
      conditions.push(isNull((table as any).deletedAt))
    }

    const [record] = await db
      .select()
      .from(table)
      .where(and(...conditions))
      .limit(1)

    if (!record) {
      return c.json({ error: 'Record not found' }, 404)
    }
    return c.json({ data: record })
  })

  // PATCH update record
  router.patch(`${basePath}/:id`, async (c) => {
    const db = createDb(c.env.DB)
    const id = c.req.param('id')
    const body = await c.req.json().catch(() => ({}))

    if (Object.keys(body).length === 0) {
      return c.json({ error: 'Empty payload' }, 400)
    }

    // Set standard updated timestamp
    const payload = { ...body, updatedAt: new Date() }

    const result = await db
      .update(table)
      .set(payload)
      .where(eq((table as any).id, id))
      .returning()

    if (result.length === 0) {
      return c.json({ error: 'Record not found' }, 404)
    }

    return c.json({ data: result[0] })
  })

  // DELETE record (soft delete if supported, otherwise hard delete)
  router.delete(`${basePath}/:id`, async (c) => {
    const db = createDb(c.env.DB)
    const id = c.req.param('id')

    if ((table as any).deletedAt) {
      const result = await db
        .update(table)
        .set({ deletedAt: new Date() })
        .where(eq((table as any).id, id))
        .returning()

      if (result.length === 0) return c.json({ error: 'Record not found' }, 404)
    } else {
      const result = await db.delete(table).where(eq((table as any).id, id)).returning()
      if (result.length === 0) return c.json({ error: 'Record not found' }, 404)
    }

    return c.json({ success: true })
  })
}
