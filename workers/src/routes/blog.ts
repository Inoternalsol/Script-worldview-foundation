import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, and, desc, sql } from 'drizzle-orm'
import { createDb } from '../db/client'
import { blogPosts } from '../../../lib/db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'

import { Env } from '../types'

export const blogRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()

const blogSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  categoryId: z.string().optional(),
  featuredImage: z.string().url().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  readTimeMinutes: z.number().int().min(1).optional(),
})

// GET /api/blog - List blog posts (public, but draft/archived hidden unless authenticated)
blogRoutes.get('/', async (c) => {
  const db = createDb(c.env.DB)
  const status = c.req.query('status')
  const category = c.req.query('category')
  const search = c.req.query('search')
  const page = parseInt(c.req.query('page') || '1', 10)
  const limit = parseInt(c.req.query('limit') || '7', 10)
  
  const targetStatus = status || 'published'
  
  const conditions = [eq(blogPosts.status, targetStatus as any)]
  
  if (category && category !== 'all') {
    conditions.push(eq(blogPosts.categoryId, category))
  }
  
  if (search) {
    conditions.push(sql`${blogPosts.title} LIKE ${'%' + search + '%'}`)
  }

  const offset = (page - 1) * limit

  const [posts, [{ total }]] = await Promise.all([
    db
      .select()
      .from(blogPosts)
      .where(and(...conditions))
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ total: sql<number>`count(*)` })
      .from(blogPosts)
      .where(and(...conditions))
  ])

  return c.json({ data: posts, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } })
})

// GET /api/blog/:slug - Single post
blogRoutes.get('/:slug', async (c) => {
  const db = createDb(c.env.DB)
  const slug = c.req.param('slug')

  const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)

  if (!post.length) {
    return c.json({ error: 'Post not found' }, 404)
  }

  // Increment view count (fire and forget)
  c.executionCtx.waitUntil(
    db.update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, post[0].id))
      .run()
  )

  return c.json({ data: post[0] })
})

// Protected routes
blogRoutes.use('*', authMiddleware)

function sanitizeHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s+on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*(["']javascript:[^"']*["']|javascript:[^\s>]+)/gi, '')
}

// POST /api/blog - Create post
blogRoutes.post('/', requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const parsed = blogSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const user = c.get('user')

  const sanitizedContent = sanitizeHtml(parsed.data.content)
  const sanitizedExcerpt = parsed.data.excerpt ? sanitizeHtml(parsed.data.excerpt) : undefined

  const newPost = {
    id: nanoid(),
    ...parsed.data,
    content: sanitizedContent,
    excerpt: sanitizedExcerpt || null,
    authorId: user.id,
    publishedAt: parsed.data.status === 'published' ? new Date() : null,
  }

  try {
    await db.insert(blogPosts).values(newPost)
    return c.json({ data: newPost }, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return c.json({ error: 'Slug already exists' }, 409)
    }
    return c.json({ error: 'Database error' }, 500)
  }
})

// PUT /api/blog/:id - Update post
blogRoutes.put('/:id', requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const id = c.req.param('id')
  const parsed = blogSchema.partial().safeParse(await c.req.json().catch(() => null))
  
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  
  const sanitizedContent = parsed.data.content ? sanitizeHtml(parsed.data.content) : undefined
  const sanitizedExcerpt = parsed.data.excerpt ? sanitizeHtml(parsed.data.excerpt) : undefined

  const updateData = {
    ...parsed.data,
    ...(sanitizedContent ? { content: sanitizedContent } : {}),
    ...(sanitizedExcerpt !== undefined ? { excerpt: sanitizedExcerpt } : {}),
    updatedAt: new Date(),
    ...(parsed.data.status === 'published' ? { publishedAt: new Date() } : {})
  }

  const result = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id!)).returning()

  if (!result.length) {
    return c.json({ error: 'Post not found' }, 404)
  }

  return c.json({ data: result[0] })
})


// DELETE /api/blog/:id - Soft delete
blogRoutes.delete('/:id', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)

  // Soft delete by setting status to archived
  const result = await db.update(blogPosts)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(blogPosts.id, id!))
    .returning()

  if (!result.length) {
    return c.json({ error: 'Post not found' }, 404)
  }

  return c.json({ success: true })
})
