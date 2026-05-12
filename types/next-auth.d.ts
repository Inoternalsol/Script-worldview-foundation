import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      role?: string
      department?: string | null
      status?: string
    }
  }

  interface User {
    role?: string
    department?: string | null
    status?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    department?: string | null
    status?: string
  }
}

