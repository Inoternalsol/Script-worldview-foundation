import { nanoid } from 'nanoid'

export type SeedUser = {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'dept_admin' | 'content_editor' | 'viewer'
  department: string | null
}

export function getDevSeed() {
  const users: SeedUser[] = [
    {
      id: nanoid(),
      name: 'System Administrator',
      email: 'admin@scriptworldviewfoundation.org',
      role: 'super_admin',
      department: null,
    },
  ]

  return { users }
}

