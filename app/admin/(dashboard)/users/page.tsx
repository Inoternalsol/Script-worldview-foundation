'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Plus, RefreshCw, UserCheck, UserX } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

import { adminClientFetch } from '@/lib/admin-client'

type User = {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'dept_admin' | 'content_editor' | 'viewer'
  status: 'active' | 'suspended'
  lastLogin: string | number | null
}

export default function UsersManagementPage() {
  const { toast } = useToast()
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  async function fetchUsers() {
    try {
      const data = await adminClientFetch<User[]>('/users')
      setUsersList(data || [])
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function toggleStatus(id: string, currentStatus: string, name: string) {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active'
    try {
      await adminClientFetch(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      })
      
      setUsersList((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
      )

      toast({
        title: 'User Status Updated',
        description: `${name} is now ${nextStatus}.`,
      })
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  async function handleResetPassword(id: string, email: string) {
    try {
      const tempPassword = Math.random().toString(36).slice(-10) + 'A1!'
      await adminClientFetch(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ password: tempPassword }),
      })
      
      toast({
        title: 'Password Reset Successful',
        description: `Reset password to temporary: ${tempPassword}. Instructions sent to ${email}.`,
      })
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCreating(true)

    const form = new FormData(e.currentTarget)
    const body = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      role: form.get('role') as string,
      status: 'active',
      password: form.get('password') as string || undefined,
    }

    try {
      const data = await adminClientFetch<User>('/users', {
        method: 'POST',
        body: JSON.stringify(body),
      })
      setUsersList((prev) => [data, ...prev])
      setOpen(false)
      toast({
        title: 'User Created',
        description: `Staff account for ${body.name} has been successfully created.`,
      })
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-sm text-brand-muted">Manage staff accounts, access levels, and active status.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="cta" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Staff Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Staff Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" required placeholder="Staff member's name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="name@scriptworldviewfoundation.org" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password (Optional)</Label>
                <Input id="password" name="password" type="password" placeholder="Leave blank for default" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  name="role"
                  required
                  title="Role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="viewer">Viewer (Read-only)</option>
                  <option value="content_editor">Content Editor</option>
                  <option value="dept_admin">Department Administrator</option>
                  <option value="super_admin">Super Administrator</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="cta" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs font-bold uppercase tracking-wider text-brand-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brand-muted">
                      Loading user list...
                    </td>
                  </tr>
                ) : usersList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brand-muted">
                      No staff accounts found.
                    </td>
                  </tr>
                ) : (
                  usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 font-semibold text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-brand-muted">{user.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="capitalize flex items-center gap-1.5 w-fit">
                          <Shield className="h-3 w-3 text-brand-primary" />
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className="capitalize"
                          variant={user.status === 'active' ? 'default' : 'destructive'}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-brand-muted">
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Never logged in'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleResetPassword(user.id, user.email)}
                            className="flex items-center gap-1"
                          >
                            <RefreshCw className="h-3.5 w-3.5" /> Reset
                          </Button>
                          <Button
                            size="sm"
                            variant={user.status === 'active' ? 'destructive' : 'default'}
                            onClick={() => toggleStatus(user.id, user.status, user.name)}
                            className="flex items-center gap-1 min-w-[90px] justify-center"
                          >
                            {user.status === 'active' ? (
                              <>
                                <UserX className="h-3.5 w-3.5" /> Suspend
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3.5 w-3.5" /> Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
