import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { getServerEnv } from '@/lib/env'

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

        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        })

        if (!res.ok) return null

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
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      if (request.nextUrl.pathname.startsWith('/admin/login')) return true
      if (request.nextUrl.pathname.startsWith('/admin')) return !!auth?.user
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.department = (user as { department?: string | null }).department
        token.status = (user as { status?: string }).status
      }
      return token
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
          role: (token as any).role,
          department: (token as any).department,
          status: (token as any).status,
        },
      }
    },
  },
})

