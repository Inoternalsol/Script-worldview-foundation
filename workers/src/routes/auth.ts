import bcrypt from 'bcryptjs'
import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { createDb } from '../db/client'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

import { Env } from '../types'

export const authRoutes = new Hono<{ Bindings: Env }>()

const registerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(255),
  password: z.string().min(8).max(200),
  role: z.enum(['super_admin', 'dept_admin', 'content_editor', 'viewer']).optional(),
  department: z.string().max(120).optional(),
})

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(200),
})


authRoutes.post('/register', async (c) => {
  if (c.env.ENVIRONMENT !== 'development') {
    return c.json({ error: 'Registration disabled' }, 403)
  }

  const parsed = registerSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const db = createDb(c.env.DB)
  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  const user = {
    id: nanoid(),
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    passwordHash,
    role: parsed.data.role ?? 'viewer',
    department: parsed.data.department ?? null,
    status: 'active' as const,
    avatarUrl: null,
    lastLogin: null,
  }

  try {
    await db.insert(users).values(user)
  } catch {
    return c.json({ error: 'Account already exists' }, 409)
  }

  return c.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      avatarUrl: user.avatarUrl,
    },
  })
})

authRoutes.post('/login', async (c) => {
  const parsed = loginSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const db = createDb(c.env.DB)
  const email = parsed.data.email.toLowerCase()
  const found = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const user = found[0]

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  if (user.status !== 'active') {
    return c.json({ error: 'Account suspended' }, 403)
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash)
  if (!ok) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  return c.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      avatarUrl: user.avatarUrl,
    },
  })
})

