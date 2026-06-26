import bcrypt from 'bcryptjs'
import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { createDb } from '../db/client'
import { users } from '../../../lib/db/schema'
import { eq } from 'drizzle-orm'
import { SignJWT, jwtVerify } from 'jose'
import { sendEmail } from '../utils/email'
import { getPasswordResetHtml } from '../utils/email-templates'

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

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(200),
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

// POST /api/auth/forgot-password - Generate password reset token
authRoutes.post('/forgot-password', async (c) => {
  const parsed = forgotPasswordSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const db = createDb(c.env.DB)
  const email = parsed.data.email.toLowerCase()
  const found = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const user = found[0]

  // Standard secure response (avoid email enumeration)
  const successResponse = { ok: true, message: 'If the email exists, a password reset link has been sent' }

  if (!user) {
    return c.json(successResponse)
  }

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET)
    const token = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .sign(secret)

    const frontendUrl = c.env.FRONTEND_URL || 'http://localhost:3000'
    const resetUrl = `${frontendUrl}/admin/reset-password?token=${token}`

    const htmlContent = getPasswordResetHtml(user.name, resetUrl)
    
    // Send email using Resend
    await sendEmail({
      RESEND_API_KEY: c.env.RESEND_API_KEY,
      EMAIL_FROM: c.env.EMAIL_FROM
    }, {
      to: user.email,
      subject: 'Reset Your Password - Script Worldview Foundation',
      html: htmlContent,
    })

    return c.json(successResponse)
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// POST /api/auth/reset-password - Verify reset token and set new password
authRoutes.post('/reset-password', async (c) => {
  const parsed = resetPasswordSchema.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ error: 'Invalid input' }, 400)
  }

  const db = createDb(c.env.DB)

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET)
    const { payload } = await jwtVerify(parsed.data.token, secret)
    const email = payload.email as string | undefined

    if (!email) {
      return c.json({ error: 'Invalid token payload' }, 400)
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)
    const result = await db.update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.email, email))
      .returning()

    if (!result.length) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ ok: true, message: 'Password has been reset successfully' })
  } catch (error: any) {
    console.error('Reset password token error:', error)
    return c.json({ error: 'Invalid or expired reset token' }, 400)
  }
})


