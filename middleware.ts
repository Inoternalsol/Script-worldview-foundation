import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const authMiddleware = auth((req) => {
      const { pathname } = req.nextUrl
      if (
        pathname.startsWith('/admin') &&
        !pathname.startsWith('/admin/login') &&
        !pathname.startsWith('/admin/forgot-password') &&
        !pathname.startsWith('/admin/reset-password')
      ) {
        if (!req.auth?.user) {
          const loginUrl = new URL('/admin/login', req.url)
          loginUrl.searchParams.set('callbackUrl', pathname)
          return NextResponse.redirect(loginUrl)
        }
      }
      return NextResponse.next()
    }) as any

    return await authMiddleware(req, {} as any)
  } catch (err) {
    console.error('Edge middleware authentication error:', err)
    const loginUrl = new URL('/admin/login', req.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}

