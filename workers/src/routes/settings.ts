import { Hono } from 'hono'
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { createDb } from '../db/client'
import { siteSettings } from '../../../lib/db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'
import { Env } from '../types'

export const settingsRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()

const settingsSchema = z.object({
  valueJson: z.string().min(2), // Valid JSON string
})

// GET /api/settings/:key - Get a site setting (public)
settingsRoutes.get('/:key', async (c) => {
  const db = createDb(c.env.DB)
  const key = c.req.param('key')
  
  try {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1)
    
    if (!setting) {
      return c.json({ data: null })
    }
    
    return c.json({ data: JSON.parse(setting.valueJson) })
  } catch (error) {
    console.error('Failed to fetch site setting:', error)
    return c.json({ error: 'Failed to fetch setting' }, 500)
  }
})

// PUT /api/settings/:key - Update a site setting (requires auth)
settingsRoutes.put('/:key', authMiddleware, requireRole(['super_admin', 'content_editor']), async (c) => {
  const db = createDb(c.env.DB)
  const key = c.req.param('key')
  const user = c.get('user')
  
  try {
    const body = await c.req.json()
    // Validation: make sure body has the data we want
    // We expect the body to contain { data: <some json object> }
    const valueJson = JSON.stringify(body.data || body)

    await db.insert(siteSettings).values({
      key: key as string,
      valueJson,
      updatedBy: user?.id as string,
    }).onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        valueJson,
        updatedBy: user?.id as string,
        updatedAt: sql`(unixepoch() * 1000)`
      }
    })

    return c.json({ success: true, data: body.data || body })
  } catch (error) {
    console.error('Failed to update site setting:', error)
    return c.json({ error: 'Invalid request' }, 400)
  }
})
