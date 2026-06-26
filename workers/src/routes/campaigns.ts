import { Hono } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { createDb } from '../db/client'
import { campaigns } from '../../../lib/db/schema'
import { Env } from '../types'

export const campaignsRoutes = new Hono<{ Bindings: Env }>()

// GET /api/campaigns - Public list of active campaigns
campaignsRoutes.get('/', async (c) => {
  const db = createDb(c.env.DB)
  
  try {
    const results = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.status, 'active'))
      .orderBy(desc(campaigns.createdAt))
      .limit(50)

    return c.json({ data: results })
  } catch (error: any) {
    console.error('Failed to fetch public campaigns:', error)
    return c.json({ error: 'Database error', message: error.message }, 500)
  }
})

// GET /api/campaigns/:slug - Public single campaign details
campaignsRoutes.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const db = createDb(c.env.DB)

  try {
    const result = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.slug, slug))
      .limit(1)

    if (!result.length) {
      return c.json({ error: 'Campaign not found' }, 404)
    }

    return c.json({ data: result[0] })
  } catch (error: any) {
    console.error(`Failed to fetch campaign for slug ${slug}:`, error)
    return c.json({ error: 'Database error', message: error.message }, 500)
  }
})
