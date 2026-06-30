import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/login/') ||
    pathname.startsWith('/admin/forgot-password') ||
    pathname.startsWith('/admin/reset-password')
  ) {
    return NextResponse.next()
  }

  // Check for NextAuth session token cookie (v4/v5 standard names)
  const sessionCookie =
    req.cookies.get('__Secure-authjs.session-token') ||
    req.cookies.get('authjs.session-token') ||
    req.cookies.get('__Secure-next-auth.session-token') ||
    req.cookies.get('next-auth.session-token')

  if (!sessionCookie) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

