'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Terminal, Shield, Globe } from 'lucide-react'

const mockLogs = [
  { id: '1', user: 'admin@scriptworldviewfoundation.org', action: 'UPDATE', resource: 'settings', resourceId: 'global_config', ip: '192.168.1.100', date: '2026-05-19 16:45:10' },
  { id: '2', user: 'admin@scriptworldviewfoundation.org', action: 'CREATE', resource: 'users', resourceId: 'System Administrator', ip: '192.168.1.100', date: '2026-05-19 16:09:16' },
  { id: '3', user: 'john.doe@scriptworldviewfoundation.org', action: 'UPDATE', resource: 'blog_posts', resourceId: 'rebuilding-after-floods', ip: '102.89.44.12', date: '2026-05-18 10:20:44' },
  { id: '4', user: 'jane.smith@scriptworldviewfoundation.org', action: 'CREATE', resource: 'blog_posts', resourceId: 'women-cooperative-village', ip: '102.89.2.144', date: '2026-05-17 09:30:12' },
]

export default function SystemAuditLogsPage() {
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
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-brand-muted border-b border-black/5">
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
                {mockLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-semibold text-foreground font-sans text-sm">{log.user}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={log.action === 'CREATE' ? 'default' : 'secondary'}
                        className="font-sans text-[10px] font-bold"
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-brand-secondary">{log.resource}</td>
                    <td className="px-6 py-4 text-brand-primary truncate max-w-[200px]">{log.resourceId}</td>
                    <td className="px-6 py-4 text-brand-muted flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {log.ip}
                    </td>
                    <td className="px-6 py-4 text-brand-muted">{log.date}</td>
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
