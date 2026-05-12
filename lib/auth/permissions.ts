export type UserRole = 'super_admin' | 'dept_admin' | 'content_editor' | 'viewer'

export type Permission =
  | 'content:read'
  | 'content:write'
  | 'content:publish'
  | 'forms:read'
  | 'donations:read'
  | 'donations:manage'
  | 'users:read'
  | 'users:manage'
  | 'settings:manage'
  | 'audit:read'

const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'content:read',
    'content:write',
    'content:publish',
    'forms:read',
    'donations:read',
    'donations:manage',
    'users:read',
    'users:manage',
    'settings:manage',
    'audit:read',
  ],
  dept_admin: [
    'content:read',
    'content:write',
    'content:publish',
    'forms:read',
    'donations:read',
  ],
  content_editor: ['content:read', 'content:write'],
  viewer: ['content:read'],
}

export function hasPermission(role: UserRole | undefined, permission: Permission) {
  if (!role) return false
  return rolePermissions[role]?.includes(permission) ?? false
}

