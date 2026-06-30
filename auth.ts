import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { getServerEnv, signBackendToken } from '@/lib/env'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  secret: getServerEnv().NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const env = getServerEnv()
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        try {
          const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed.data),
          })

          if (!res.ok) {
            console.error('Login request failed with status:', res.status)
            return null
          }

        const data = (await res.json()) as {
          user: {
            id: string
            name: string
            email: string
            role: string
            department: string | null
            status: string
            avatarUrl: string | null
          }
        }

        if (!data.user?.id) return null

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          department: data.user.department,
          status: data.user.status,
          image: data.user.avatarUrl ?? undefined,
        }
      } catch (err: any) {
        console.error('Backend authentication fetch error:', err)
        return null
      }
    },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      if (
        pathname.startsWith('/admin/login') ||
        pathname.startsWith('/admin/forgot-password') ||
        pathname.startsWith('/admin/reset-password')
      ) {
        return true
      }
      if (pathname.startsWith('/admin')) return !!auth?.user
      return true
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = (user as { role?: string }).role || 'viewer'
          token.department = (user as { department?: string | null }).department || null
          token.status = (user as { status?: string }).status || 'active'
          
          token.backendToken = await signBackendToken({
            sub: user.id || '',
            role: token.role as string,
            department: token.department as string | null,
          }, '30d')
        } else if (token && !token.backendToken && token.sub) {
          token.backendToken = await signBackendToken({
            sub: token.sub,
            role: (token.role as string) || 'viewer',
            department: (token.department as string | null) || null,
          }, '30d')
        }
      } catch (err) {
        console.error('JWT callback error:', err)
      }
      return token
    },
    session({ session, token }) {
      if (!session || !token) return session
      try {
        return {
          ...session,
          user: {
            ...session.user,
            id: (token.sub as string) || '',
            role: (token as any).role || 'viewer',
            department: (token as any).department || null,
            status: (token as any).status || 'active',
            backendToken: (token as any).backendToken,
          },
        }
      } catch (err) {
        console.error('Session callback error:', err)
        return session
      }
    },
  },
})

