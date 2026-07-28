import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc, sql } from 'drizzle-orm'
import { createDb } from '../db/client'
import { mediaLibrary } from '../../../lib/db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'
import { Env } from '../types'

export const mediaRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()

// Helper to create Cloudinary signature
async function createCloudinarySignature(params: Record<string, string>, apiSecret: string): Promise<string> {
  // 1. Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort()
  // 2. Create param string `k1=v1&k2=v2`
  const paramString = sortedKeys.map(k => `${k}=${params[k]}`).join('&')
  // 3. Append secret
  const strToSign = paramString + apiSecret
  
  // 4. SHA-1 Hash
  const msgUint8 = new TextEncoder().encode(strToSign)
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

mediaRoutes.use('*', authMiddleware)

mediaRoutes.get('/signature', requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  if (!c.env.CLOUDINARY_API_SECRET || !c.env.CLOUDINARY_API_KEY || !c.env.CLOUDINARY_CLOUD_NAME) {
    return c.json({ error: 'Cloudinary credentials not configured' }, 500)
  }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const params = {
    timestamp,
    // Add additional params here if you want to restrict uploads
  }

  const signature = await createCloudinarySignature(params, c.env.CLOUDINARY_API_SECRET)

  return c.json({
    signature,
    timestamp,
    apiKey: c.env.CLOUDINARY_API_KEY,
    cloudName: c.env.CLOUDINARY_CLOUD_NAME
  })
})

const uploadSchema = z.object({
  filename: z.string(),
  url: z.string().url(),
  type: z.enum(['image', 'video', 'document']),
  sizeBytes: z.number().int().optional(),
  altText: z.string().optional(),
  category: z.string().optional(),
  tagsJson: z.string().optional()
})

mediaRoutes.post('/', requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const parsed = uploadSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  const user = c.get('user')

  const newMedia = {
    id: nanoid(),
    ...parsed.data,
    uploadedBy: user.id
  }

  await db.insert(mediaLibrary).values(newMedia)
  
  return c.json({ data: newMedia }, 201)
})

mediaRoutes.get('/', requireRole(['super_admin', 'dept_admin', 'content_editor']), async (c) => {
  const db = createDb(c.env.DB)
  const page = parseInt(c.req.query('page') || '1', 10)
  const limit = parseInt(c.req.query('limit') || '20', 10)
  const type = c.req.query('type') as 'image' | 'video' | 'document' | undefined
  const offset = (page - 1) * limit

  const conditions = type && type !== ('all' as any) ? eq(mediaLibrary.type, type) : undefined

  let query = db.select().from(mediaLibrary)
  if (conditions) {
    query = query.where(conditions) as any
  }
  
  const [items, [{ total }]] = await Promise.all([
    query.orderBy(desc(mediaLibrary.createdAt)).limit(limit).offset(offset),
    db.select({ total: sql<number>`count(*)` }).from(mediaLibrary).where(conditions)
  ])

  return c.json({ data: items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } })
})
