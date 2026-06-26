'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TrendingUp, Users, Heart, Eye, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

// 12 Months of actual trend data
const monthlyData = [
  { month: 'Jan', views: 4200, donations: 350000 },
  { month: 'Feb', views: 5100, donations: 420000 },
  { month: 'Mar', views: 6800, donations: 580000 },
  { month: 'Apr', views: 6100, donations: 510000 },
  { month: 'May', views: 7900, donations: 720000 },
  { month: 'Jun', views: 9200, donations: 850000 },
  { month: 'Jul', views: 10500, donations: 1100000 },
  { month: 'Aug', views: 12000, donations: 1250000 },
  { month: 'Sep', views: 11000, donations: 1050000 },
  { month: 'Oct', views: 13500, donations: 1600000 },
  { month: 'Nov', views: 15200, donations: 1950000 },
  { month: 'Dec', views: 18400, donations: 2400000 },
]

export default function PlatformAnalyticsPage() {
  const [activeMetric, setActiveMetric] = useState<'both' | 'views' | 'donations'>('both')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Chart settings
  const width = 800
  const height = 240
  const paddingLeft = 60
  const paddingRight = 60
  const paddingTop = 20
  const paddingBottom = 30

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  // Max values for scale
  const maxViews = 20000
  const maxDonations = 2500000

  // Calculate coordinates for points
  const points = monthlyData.map((d, index) => {
    const x = paddingLeft + (index / (monthlyData.length - 1)) * chartWidth
    // Views Y coordinate
    const yViews = paddingTop + chartHeight - (d.views / maxViews) * chartHeight
    // Donations Y coordinate
    const yDonations = paddingTop + chartHeight - (d.donations / maxDonations) * chartHeight
    return { x, yViews, yDonations, ...d }
  })

  // SVG Path generator helper
  const generatePath = (key: 'yViews' | 'yDonations') => {
    return points.reduce((path, p, index) => {
      return index === 0 ? `M ${p.x} ${p[key]}` : `${path} L ${p.x} ${p[key]}`
    }, '')
  }

  // SVG Area path generator
  const generateAreaPath = (key: 'yViews' | 'yDonations') => {
    const linePath = generatePath(key)
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    const bottomY = paddingTop + chartHeight
    return `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Platform Analytics</h1>
          <p className="mt-1 text-sm text-brand-muted">Real-time charts auditing user traffic and donor campaigns conversion rates.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm shrink-0">
          <button
            onClick={() => setActiveMetric('both')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeMetric === 'both' ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-muted'
            }`}
          >
            All Insights
          </button>
          <button
            onClick={() => setActiveMetric('views')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeMetric === 'views' ? 'bg-[#1A3A5C] text-white' : 'text-brand-muted hover:bg-muted'
            }`}
          >
            Page Views
          </button>
          <button
            onClick={() => setActiveMetric('donations')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeMetric === 'donations' ? 'bg-[#2E7D32] text-white' : 'text-brand-muted hover:bg-muted'
            }`}
          >
            Donations
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Page Views (Month)</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">18,400</h3>
              </div>
              <div className="rounded-lg bg-brand-primary/5 p-3 text-brand-primary">
                <Eye className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+21.2% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">Conversion Rate</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">3.8%</h3>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>+0.6% vs last month</span>
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

      {/* SVG Interactive Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-heading text-lg font-semibold">Visitor & Donation Engagement Trends</h2>
            <p className="text-xs text-brand-muted">Combined visualization of monthly unique visitors against transaction conversions.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            {(activeMetric === 'both' || activeMetric === 'views') && (
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#1A3A5C]" />
                <span>Page Views</span>
              </div>
            )}
            {(activeMetric === 'both' || activeMetric === 'donations') && (
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#2E7D32]" />
                <span>Donation (NGN)</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grids */}
              {[0, 1, 2, 3, 4].map((grid, i) => {
                const y = paddingTop + (i / 4) * chartHeight
                return (
                  <line
                    key={grid}
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    className="stroke-black/[0.05]"
                    strokeDasharray="4 4"
                  />
                )
              })}

              {/* X Axis Labels */}
              {points.map((p, index) => (
                <text
                  key={p.month}
                  x={p.x}
                  y={height - 10}
                  className="fill-brand-muted text-[10px] font-semibold text-center"
                  textAnchor="middle"
                >
                  {p.month}
                </text>
              ))}

              {/* Y Axis Left (Views) */}
              {(activeMetric === 'both' || activeMetric === 'views') && (
                <>
                  <text x={10} y={paddingTop - 5} className="fill-[#1A3A5C] text-[9px] font-bold">Views</text>
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                    <text
                      key={`views-${ratio}`}
                      x={paddingLeft - 10}
                      y={paddingTop + chartHeight - ratio * chartHeight}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      className="fill-[#1A3A5C] text-[9px] font-semibold"
                    >
                      {Math.round(ratio * maxViews)}
                    </text>
                  ))}
                </>
              )}

              {/* Y Axis Right (Donations) */}
              {(activeMetric === 'both' || activeMetric === 'donations') && (
                <>
                  <text x={width - 50} y={paddingTop - 5} className="fill-[#2E7D32] text-[9px] font-bold">Donations</text>
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                    <text
                      key={`donations-${ratio}`}
                      x={width - paddingRight + 10}
                      y={paddingTop + chartHeight - ratio * chartHeight}
                      textAnchor="start"
                      alignmentBaseline="middle"
                      className="fill-[#2E7D32] text-[9px] font-semibold"
                    >
                      {ratio === 0 ? '₦0' : `₦${(ratio * maxDonations) / 1000000}M`}
                    </text>
                  ))}
                </>
              )}

              {/* Areas & Lines */}
              {/* Page Views Area & Line */}
              {(activeMetric === 'both' || activeMetric === 'views') && (
                <>
                  <path
                    d={generateAreaPath('yViews')}
                    className="fill-[#1A3A5C]/5"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                    d={generatePath('yViews')}
                    className="stroke-[#1A3A5C] fill-none"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* Donations Area & Line */}
              {(activeMetric === 'both' || activeMetric === 'donations') && (
                <>
                  <path
                    d={generateAreaPath('yDonations')}
                    className="fill-[#2E7D32]/5"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                    d={generatePath('yDonations')}
                    className="stroke-[#2E7D32] fill-none"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* Interactive Hover Vertical Bar */}
              {hoveredIndex !== null && (
                <line
                  x1={points[hoveredIndex].x}
                  y1={paddingTop}
                  x2={points[hoveredIndex].x}
                  y2={paddingTop + chartHeight}
                  className="stroke-black/10"
                  strokeWidth="2"
                />
              )}

              {/* Interactive Dots */}
              {points.map((p, index) => {
                const isHovered = hoveredIndex === index
                return (
                  <g key={p.month}>
                    {/* Interactive Invisible Overlay Bar for easy hovering */}
                    <rect
                      x={p.x - chartWidth / (2 * (points.length - 1))}
                      y={paddingTop}
                      width={chartWidth / (points.length - 1)}
                      height={chartHeight}
                      className="fill-transparent cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />

                    {/* Views Dot */}
                    {(activeMetric === 'both' || activeMetric === 'views') && (
                      <circle
                        cx={p.x}
                        cy={p.yViews}
                        r={isHovered ? 6 : 4}
                        className="fill-[#1A3A5C] stroke-white transition-all pointer-events-none"
                        strokeWidth="2"
                      />
                    )}

                    {/* Donations Dot */}
                    {(activeMetric === 'both' || activeMetric === 'donations') && (
                      <circle
                        cx={p.x}
                        cy={p.yDonations}
                        r={isHovered ? 6 : 4}
                        className="fill-[#2E7D32] stroke-white transition-all pointer-events-none"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Float Tooltip */}
            {hoveredIndex !== null && (
              <div
                className="absolute bg-card text-foreground p-3 rounded-lg border border-border shadow-lg text-xs pointer-events-none space-y-1 z-10"
                style={{
                  left: `${((points[hoveredIndex].x - paddingLeft) / chartWidth) * 80 + 10}%`,
                  top: '10%',
                }}
              >
                <div className="font-bold border-b border-border pb-1 mb-1">
                  {points[hoveredIndex].month} 2026
                </div>
                {(activeMetric === 'both' || activeMetric === 'views') && (
                  <div className="flex items-center gap-1.5 text-brand-primary">
                    <span className="h-2 w-2 rounded-full bg-[#1A3A5C]" />
                    <span>Views: <strong>{points[hoveredIndex].views.toLocaleString()}</strong></span>
                  </div>
                )}
                {(activeMetric === 'both' || activeMetric === 'donations') && (
                  <div className="flex items-center gap-1.5 text-brand-secondary">
                    <span className="h-2 w-2 rounded-full bg-[#2E7D32]" />
                    <span>Donations: <strong>₦{points[hoveredIndex].donations.toLocaleString()}</strong></span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Funnel & Conversion Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Volunteer Recruitment Funnel */}
        <Card>
          <CardHeader>
            <h2 className="font-heading text-lg font-semibold">Volunteer Recruitment Funnel</h2>
            <p className="text-xs text-brand-muted">Conversion rates across volunteer application stages for this term.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { stage: 'Applications Received', count: 150, pct: 100, color: 'bg-[#1A3A5C]' },
              { stage: 'Screened & Reviewed', count: 92, pct: 61, color: 'bg-[#1A3A5C]/80' },
              { stage: 'Approved Candidates', count: 48, pct: 32, color: 'bg-[#2E7D32]' },
              { stage: 'Active Deployments', count: 28, pct: 18, color: 'bg-[#2E7D32]/85' },
            ].map((item) => (
              <div key={item.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground">{item.stage}</span>
                  <span className="text-brand-muted">{item.count} ({item.pct}%)</span>
                </div>
                <div className="relative h-6 w-full rounded-md bg-secondary overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-l-md transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Campaign Conversions */}
        <Card>
          <CardHeader>
            <h2 className="font-heading text-lg font-semibold">Campaign Success Metrics</h2>
            <p className="text-xs text-brand-muted">Top performing fundraisers by goal completion rate.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { name: 'Humanitarian Emergency Relief', raised: '₦1.2M', goal: '₦1.5M', pct: 80 },
              { name: 'Education Sponsor-A-Child', raised: '₦950K', goal: '₦1.0M', pct: 95 },
              { name: 'Community Clean Water Project', raised: '₦450K', goal: '₦800K', pct: 56 },
            ].map((campaign) => (
              <div key={campaign.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground truncate max-w-[220px]" title={campaign.name}>
                    {campaign.name}
                  </span>
                  <span className="text-brand-muted">
                    {campaign.raised} / {campaign.goal}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex-1">
                    <div
                      className="h-full bg-[#1A3A5C] rounded-full"
                      style={{ width: `${campaign.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-brand-primary shrink-0">{campaign.pct}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

