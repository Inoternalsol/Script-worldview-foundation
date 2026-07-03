import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getServerEnv, signBackendToken } from '@/lib/env'
import { revalidatePath } from 'next/cache'


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
  try {
    let env
    try {
      env = getServerEnv()
    } catch (err: any) {
      console.error('Env validation failed on Next.js server:', err)
      return NextResponse.json({ error: 'Server Env Configuration Error', message: err?.message || String(err) }, { status: 500 })
    }

    let session = null
    try {
      session = await auth()
    } catch (err: any) {
      console.error('API proxy auth verification error:', err)
      return NextResponse.json({ error: 'Authentication verification failed', details: err?.message || String(err) }, { status: 401 })
    }

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Access Denied' }, { status: 401 })
    }

    const user = session.user as any
    let bearerToken = user.backendToken
    if (!bearerToken) {
      try {
        bearerToken = await signBackendToken({
          sub: user.id || '',
          role: user.role || 'viewer',
          department: user.department || null,
        }, '10m')
      } catch (tokenErr: any) {
        console.error('Failed to sign fallback backend token:', tokenErr)
        return NextResponse.json({ error: 'JWT Signing Error', details: tokenErr?.message || String(tokenErr) }, { status: 500 })
      }
    }

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

    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: 'no-store',
    })

    const contentType = res.headers.get('content-type') || ''
    const responseBody = await res.text().catch(() => '')

    if (contentType.includes('text/csv')) {
      return new NextResponse(responseBody, {
        status: res.status,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': res.headers.get('Content-Disposition') || 'attachment; filename="export.csv"',
          'Access-Control-Expose-Headers': 'Content-Disposition',
        },
      })
    }

    let responseData
    try {
      responseData = JSON.parse(responseBody)
    } catch {
      responseData = responseBody
    }

    if (!res.ok && typeof responseData === 'string') {
      responseData = {
        error: `Cloudflare Worker returned ${res.status}: ${responseData || res.statusText}`,
        status: res.status,
        targetUrl,
      }
    }

    // Run on-demand revalidation if the mutation succeeded
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
    if (isMutation && res.status >= 200 && res.status < 300) {
      const segment = pathSegments[0]
      const routesToPurge = ['/', '/about', '/contact', '/get-involved', '/programs', '/blog', '/events', '/campaigns', '/careers', '/partners', '/stories', '/transparency']
      if (['blog', 'events', 'campaigns', 'programs', 'careers', 'settings', 'pages'].includes(segment)) {
        try {
          routesToPurge.forEach(r => revalidatePath(r, 'layout'))
          console.log(`[ISR Revalidation] Purged cache for public pages after mutation on /${segment}`)
        } catch (revalErr) {
          console.error(`[ISR Revalidation] Failed to revalidate paths:`, revalErr)
        }
      }
    }

    return NextResponse.json(
      responseData,
      { status: res.status }
    )
  } catch (fatalError: any) {
    console.error('Unhandled fatal error in API proxy:', fatalError)
    return NextResponse.json({
      error: 'Next.js API Proxy Fatal Error',
      message: fatalError?.message || String(fatalError),
      stack: process.env.NODE_ENV === 'development' ? fatalError?.stack : undefined
    }, { status: 500 })
  }
}
