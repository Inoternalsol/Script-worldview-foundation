import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { SignJWT } from 'jose'
import { getServerEnv } from '@/lib/env'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params.path)
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params.path)
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params.path)
}

export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params.path)
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params.path)
}

async function handleProxy(req: NextRequest, pathSegments: string[]) {
  let env
  try {
    env = getServerEnv()
  } catch (err: any) {
    console.error('Env validation failed on Next.js server:', err)
    return NextResponse.json({ error: 'Server Env Configuration Error', message: err.message || String(err) }, { status: 500 })
  }

  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized: Access Denied' }, { status: 401 })
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    console.error('JWT_SECRET is not configured on Next.js server')
    return NextResponse.json({ error: 'Server Configuration Error', message: 'JWT_SECRET is missing from environment variables' }, { status: 500 })
  }

  const user = session.user as any

  // Sign standard JWT matching Hono's authMiddleware verification (Phase 9)
  const secretKey = new TextEncoder().encode(jwtSecret)
  const bearerToken = await new SignJWT({
    sub: user.id || '',
    role: user.role || 'viewer',
    department: user.department || null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m') // 10 minutes short expiry
    .sign(secretKey)

  const path = pathSegments.join('/')
  const searchParams = req.nextUrl.searchParams.toString()
  const targetUrl = `${env.NEXT_PUBLIC_API_URL}/api/admin/${path}${searchParams ? `?${searchParams}` : ''}`

  const headers = new Headers()
  headers.set('Authorization', `Bearer ${bearerToken}`)
  headers.set('Content-Type', 'application/json')

  const method = req.method
  const isBodyMethod = ['POST', 'PUT', 'PATCH'].includes(method)
  let body: any = undefined

  if (isBodyMethod) {
    body = await req.text().catch(() => '')
  }

  try {
    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: 'no-store',
    })

    const responseBody = await res.text().catch(() => '')
    let responseData
    try {
      responseData = JSON.parse(responseBody)
    } catch {
      responseData = responseBody
    }

    return NextResponse.json(
      responseData,
      { status: res.status }
    )
  } catch (error: any) {
    console.error(`Proxy forwarding failed to: ${targetUrl}`, error)
    return NextResponse.json({ error: 'Failed to communicate with API service', details: error.message }, { status: 502 })
  }
}
