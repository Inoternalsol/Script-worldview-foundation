import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, asc } from 'drizzle-orm'
import { createDb } from '../db/client'
import { programs } from '../db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'

type Bindings = {
  DB: D1Database
  ENVIRONMENT: string
}

export const programsRoutes = new Hono<{ Bindings: Bindings; Variables: { user: any } }>()

const programSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().min(1),
  category: z.enum(['education', 'humanitarian', 'community', 'research', 'capacity']),
  icon: z.string().optional(),
  featuredImage: z.string().url().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  sortOrder: z.number().int().default(0),
})

// GET /api/programs
programsRoutes.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const category = c.req.query('category')
  const status = c.req.query('status')
  
  // Basic filtering
  // For a robust API, we'd use 'and()' but keeping it simple for now or building conditions array
  let query = db.select().from(programs).$dynamic()
  
  if (category) {
    query = query.where(eq(programs.category, category as any))
  }
  // Note: Drizzle dynamic queries are tricky without proper where() chaining,
  // so let's simplify for the common case:
  let conditions = undefined
  if (category) conditions = eq(programs.category, category as any)

  const allPrograms = await db
    .select()
    .from(programs)
    .where(conditions)
    .orderBy(asc(programs.sortOrder), asc(programs.name))

  return c.json({ data: allPrograms })
})

// GET /api/programs/:slug
programsRoutes.get('/:slug', async (c) => {
  const db = createDb(c.env.DB)
  const slug = c.req.param('slug')

  const programList = await db.select().from(programs).where(eq(programs.slug, slug)).limit(1)

  if (!programList.length) {
    return c.json({ error: 'Program not found' }, 404)
  }

  return c.json({ data: programList[0] })
})

// Protected routes
programsRoutes.use('*', authMiddleware)

// POST /api/programs
programsRoutes.post('/', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const parsed = programSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)

  const newProgram = {
    id: nanoid(),
    ...parsed.data,
  }

  try {
    await db.insert(programs).values(newProgram)
    return c.json({ data: newProgram }, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return c.json({ error: 'Slug already exists' }, 409)
    }
    return c.json({ error: 'Database error' }, 500)
  }
})

// PUT /api/programs/:id
programsRoutes.put('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const parsed = programSchema.partial().safeParse(await c.req.json().catch(() => null))
  
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  
  const updateData = {
    ...parsed.data,
    updatedAt: new Date(),
  }

  const result = await db.update(programs).set(updateData).where(eq(programs.id, id!)).returning()

  if (!result.length) {
    return c.json({ error: 'Program not found' }, 404)
  }

  return c.json({ data: result[0] })
})

// DELETE /api/programs/:id
programsRoutes.delete('/:id', requireRole(['super_admin']), async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)

  const result = await db.delete(programs).where(eq(programs.id, id!)).returning()

  if (!result.length) {
    return c.json({ error: 'Program not found' }, 404)
  }

  return c.json({ success: true })
})
