'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Plus, RefreshCw, UserCheck, UserX } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

// Mock initial data
const mockUsers = [
  { id: '1', name: 'System Administrator', email: 'admin@scriptworldviewfoundation.org', role: 'super_admin', status: 'active', lastLogin: '2026-05-19 16:40' },
  { id: '2', name: 'John Doe', email: 'john.doe@scriptworldviewfoundation.org', role: 'dept_admin', status: 'active', lastLogin: '2026-05-18 10:20' },
  { id: '3', name: 'Jane Smith', email: 'jane.smith@scriptworldviewfoundation.org', role: 'content_editor', status: 'active', lastLogin: '2026-05-17 09:15' },
  { id: '4', name: 'Mark Wilson', email: 'mark.wilson@scriptworldviewfoundation.org', role: 'viewer', status: 'suspended', lastLogin: '2026-05-10 11:00' },
]

export default function UsersManagementPage() {
  const { toast } = useToast()
  const [usersList, setUsersList] = useState(mockUsers)

  function toggleStatus(id: string) {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active'
          toast({
            title: 'User Status Updated',
            description: `${u.name} is now ${nextStatus}.`,
          })
          return { ...u, status: nextStatus }
        }
        return u
      })
    )
  }

  function handleResetPassword(email: string) {
    toast({
      title: 'Email Sent',
      description: `Reset password instructions have been sent to ${email}.`,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-sm text-brand-muted">Manage staff accounts, access levels, and active status.</p>
        </div>
        <Button variant="cta" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Staff Account
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-brand-muted border-b border-black/5">
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
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
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
                    <td className="px-6 py-4 text-brand-muted">{user.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleResetPassword(user.email)}
                          className="flex items-center gap-1"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Reset
                        </Button>
                        <Button
                          size="sm"
                          variant={user.status === 'active' ? 'destructive' : 'default'}
                          onClick={() => toggleStatus(user.id)}
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
