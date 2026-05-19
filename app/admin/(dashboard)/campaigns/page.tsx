'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Target, Calendar, Edit, Eye } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const mockCampaigns = [
  { id: '1', title: 'Primary Literacy Drive', goal: 2000000, raised: 1450000, status: 'active', deadline: '2026-08-30' },
  { id: '2', title: 'Emergency Flood Relief 2026', goal: 5000000, raised: 5200000, status: 'completed', deadline: '2026-05-15' },
  { id: '3', title: 'Community Water Rehabilitation', goal: 3500000, raised: 800000, status: 'active', deadline: '2026-10-01' },
]

export default function AdminCampaignsPage() {
  const { toast } = useToast()
  const [campaignsList, setCampaignsList] = useState(mockCampaigns)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Fundraising Campaigns</h1>
          <p className="mt-1 text-sm text-brand-muted">Track progress, edit goals, and launch new fundraisers.</p>
        </div>
        <Button variant="cta" className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Campaign
        </Button>
      </div>

      <div className="grid gap-6">
        {campaignsList.map((campaign) => {
          const percent = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
          return (
            <Card key={campaign.id} className="overflow-hidden border border-black/10">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-foreground">{campaign.title}</h3>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-brand-muted">
                      <span className="flex items-center gap-1">
                        <Target className="h-3.5 w-3.5 text-brand-primary" /> Goal: ₦{campaign.goal.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-brand-secondary" /> Deadline: {campaign.deadline}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="secondary" size="sm" className="flex items-center gap-1">
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="text-brand-primary">₦{campaign.raised.toLocaleString()} raised</span>
                    <span className="text-brand-muted">{percent}%</span>
                  </div>
                  <Progress value={percent} className="h-2 bg-gray-100" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
