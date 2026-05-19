'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Mail, Send, Eye, Users } from 'lucide-react'

export default function AdminEmailCampaignsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  function handleSend() {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: 'Newsletter Dispatched',
        description: 'Successfully queued newsletter to all subscribed segments.',
      })
    }, 1000)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Email Manager</h1>
        <p className="mt-1 text-sm text-brand-muted">Compose and dispatch branded newsletters, press releases, or custom emails via Resend.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="border-b border-black/5 pb-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-brand-primary" />
              <div>
                <h2 className="font-heading text-lg font-semibold">Compose Email</h2>
                <p className="text-xs text-brand-muted">Draft your email message and target recipient segments.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="segment">Target Recipient Segment</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="segment">
                    <SelectValue placeholder="Select target segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Newsletter Subscribers (1,240)</SelectItem>
                    <SelectItem value="volunteers">Active Volunteers (84)</SelectItem>
                    <SelectItem value="donors">Past Donors (320)</SelectItem>
                    <SelectItem value="research">Research Publication Downloader (150)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender">Send From Address</Label>
                <Input id="sender" defaultValue="noreply@scriptworldviewfoundation.org" disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input id="subject" placeholder="e.g. Shaping Minds: Monthly Progress Update - May 2026" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Email Message (HTML / Text)</Label>
              <Textarea
                id="body"
                rows={10}
                placeholder="Write your email body here... Branded header, CTA buttons, and standard footers will be automatically appended."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" className="flex items-center gap-2">
                <Eye className="h-4 w-4" /> Preview Email
              </Button>
              <Button variant="cta" onClick={handleSend} disabled={loading} className="flex items-center gap-2">
                <Send className="h-4 w-4" /> {loading ? 'Sending...' : 'Send Newsletter'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
