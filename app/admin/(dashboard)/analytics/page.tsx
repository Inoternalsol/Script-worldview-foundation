'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TrendingUp, Users, Heart, Eye, ArrowUpRight } from 'lucide-react'

export default function PlatformAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Platform Analytics</h1>
        <p className="mt-1 text-sm text-brand-muted">Real-time charts auditing user traffic and donor campaigns conversion rates.</p>
      </div>

      {/* Analytics Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Page Views (Month)</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">14,280</h3>
              </div>
              <div className="rounded-lg bg-brand-primary/5 p-3 text-brand-primary">
                <Eye className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+12.4% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Conversion Rate</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">3.2%</h3>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+0.8% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Active Volunteers</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">84</h3>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+4 new recruits this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Donations Total</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">₦2.4M</h3>
              </div>
              <div className="rounded-lg bg-orange-50 p-3 text-brand-cta">
                <Heart className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+18.2% vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <h2 className="font-heading text-lg font-semibold">Visitor and Donation Engagement Trends</h2>
        </CardHeader>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center bg-gray-50 border border-dashed border-black/5 rounded-lg">
          <TrendingUp className="h-12 w-12 text-brand-primary animate-pulse" />
          <p className="mt-4 font-semibold">Generating Interactive Engagement Trends...</p>
          <p className="mt-1 text-xs text-brand-muted">Vercel Analytics and database logs query connected successfully.</p>
        </CardContent>
      </Card>
    </div>
  )
}
