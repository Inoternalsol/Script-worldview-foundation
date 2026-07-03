import { adminFetch } from '@/lib/admin-api'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe } from 'lucide-react'

type AuditLog = {
  id: string
  userId: string | null
  action: string
  resource: string
  resourceId: string | null
  ipAddress: string | null
  timestamp: string | number
}

async function getLogs(): Promise<AuditLog[]> {
  try {
    const res = await adminFetch('/audit-log')
    return res.data
  } catch {
    return []
  }
}

import { Suspense } from 'react'
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton'

async function AuditLogsLoader() {
  const logsList = await getLogs()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">System Audit Logs</h1>
        <p className="mt-1 text-sm text-brand-muted">Read-only immutable logs of all staff dashboard operations.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs font-bold uppercase tracking-wider text-brand-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target Resource</th>
                  <th className="px-6 py-4">Resource Identifier</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-mono text-xs">
                {logsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brand-muted">
                      No system logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  logsList.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 font-semibold text-foreground font-sans text-sm">
                        {log.userId || 'system'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={log.action === 'CREATE' ? 'default' : 'secondary'}
                          className="font-sans text-[10px] font-bold"
                        >
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-brand-secondary">{log.resource}</td>
                      <td className="px-6 py-4 text-brand-primary truncate max-w-[200px]">
                        {log.resourceId || '—'}
                      </td>
                      <td className="px-6 py-4 text-brand-muted flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="px-6 py-4 text-brand-muted">
                        {new Date(log.timestamp).toLocaleString('en-US')}
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

export default function SystemAuditLogsPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <AuditLogsLoader />
    </Suspense>
  )
}
