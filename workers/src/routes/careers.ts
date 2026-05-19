import { Hono } from 'hono'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { eq, desc, and } from 'drizzle-orm'
import { createDb } from '../db/client'
import { jobPostings, jobApplications } from '../db/schema'
import { authMiddleware, requireRole } from '../middleware/auth'
import { sendEmail } from '../utils/email'
import { getCareerAcknowledgmentHtml } from '../utils/email-templates'

type Bindings = {
  DB: D1Database
  RESEND_API_KEY: string
  EMAIL_FROM: string
}

export const careerRoutes = new Hono<{ Bindings: Bindings; Variables: { user: any } }>()

// GET /api/careers/jobs - Public list of open jobs
careerRoutes.get('/jobs', async (c) => {
  const db = createDb(c.env.DB)
  const results = await db.select().from(jobPostings).where(eq(jobPostings.status, 'open')).orderBy(desc(jobPostings.createdAt))
  return c.json({ data: results })
})

// GET /api/careers/jobs/:id - Public single job
careerRoutes.get('/jobs/:id', async (c) => {
  const id = c.req.param('id')
  const db = createDb(c.env.DB)
  const result = await db.select().from(jobPostings).where(eq(jobPostings.id, id)).limit(1)

  if (!result.length) {
    return c.json({ error: 'Job not found' }, 404)
  }

  return c.json({ data: result[0] })
})

const applicationSchema = z.object({
  jobId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  yearsExperience: z.number().optional(),
  cvUrl: z.string().url(), // We'll handle upload on frontend and pass URL
  coverLetter: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
})

// POST /api/careers/applications - Public application submission
careerRoutes.post('/applications', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const parsed = applicationSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: 'Invalid input', details: parsed.error.format() }, 400)
  }

  const db = createDb(c.env.DB)
  
  // Verify job is still open
  const job = await db.select().from(jobPostings).where(and(eq(jobPostings.id, parsed.data.jobId), eq(jobPostings.status, 'open'))).limit(1)
  if (!job.length) {
    return c.json({ error: 'Job is no longer accepting applications' }, 400)
  }

  const id = nanoid()
  const newApplication = {
    id,
    ...parsed.data,
    status: 'received' as const,
    appliedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  try {
    await db.insert(jobApplications).values(newApplication)

    // Trigger Career Application Acknowledgment Email (Phase 7)
    const emailHtml = getCareerAcknowledgmentHtml(parsed.data.name, job[0].title)
    await sendEmail(c.env, {
      to: parsed.data.email,
      subject: `Application Received: ${job[0].title} - Script Worldview Foundation`,
      html: emailHtml,
    })

    return c.json({ success: true, id }, 201)
  } catch (err) {
    console.error('Failed to save application:', err)
    return c.json({ error: 'Database error' }, 500)
  }
})

// Protected routes for Admin
careerRoutes.use('*', authMiddleware)

// Admin Job Management
careerRoutes.post('/jobs', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const id = nanoid()
  const db = createDb(c.env.DB)
  const user = c.get('user')

  const newJob = {
    id,
    ...body, // Simplification for now, should use a schema
    createdBy: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(jobPostings).values(newJob)
  return c.json({ data: newJob }, 201)
})

// Admin Application Management
careerRoutes.get('/applications', requireRole(['super_admin', 'dept_admin']), async (c) => {
  const db = createDb(c.env.DB)
  const results = await db.select().from(jobApplications).orderBy(desc(jobApplications.appliedAt)).limit(100)
  return c.json({ data: results })
})
