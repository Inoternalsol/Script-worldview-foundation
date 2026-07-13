'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TrendingUp, Users, Heart, Eye, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { adminClientFetch } from '@/lib/admin-client'

const DEFAULT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(name => ({
  name,
  donations: 0,
  volunteers: 0,
  pageViews: 0
}))

export default function PlatformAnalyticsPage() {
  const [activeMetric, setActiveMetric] = useState<'both' | 'volunteers' | 'donations'>('both')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [monthlyData, setMonthlyData] = useState<any[]>(DEFAULT_MONTHS)
  const [isFallback, setIsFallback] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, statsRes] = await Promise.all([
          adminClientFetch('/analytics'),
          adminClientFetch('/stats')
        ])
        const analyticsList = Array.isArray(analyticsRes) ? analyticsRes : (analyticsRes?.data || [])
        if (analyticsList && analyticsList.length > 0) {
          setMonthlyData(analyticsList)
          setIsFallback(false)
        } else {
          setMonthlyData(DEFAULT_MONTHS)
          setIsFallback(true)
        }
        const statsObj = statsRes?.volunteers !== undefined ? statsRes : (statsRes?.data || null)
        if (statsObj) setStats(statsObj)
      } catch (err) {
        console.error(err)
        setIsFallback(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    )
  }

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
  const maxVolunteers = Math.max(...monthlyData.map(d => d.volunteers), 10)
  const maxDonations = Math.max(...monthlyData.map(d => d.donations), 1000)

  // Calculate coordinates for points
  const points = monthlyData.map((d, index) => {
    const x = paddingLeft + (index / (monthlyData.length - 1)) * chartWidth
    // Volunteers Y coordinate
    const yVolunteers = paddingTop + chartHeight - (d.volunteers / maxVolunteers) * chartHeight
    // Donations Y coordinate
    const yDonations = paddingTop + chartHeight - (d.donations / maxDonations) * chartHeight
    return { x, yVolunteers, yDonations, ...d }
  })

  // SVG Path generator helper
  const generatePath = (key: 'yVolunteers' | 'yDonations') => {
    return points.reduce((path, p, index) => {
      return index === 0 ? `M ${p.x} ${p[key]}` : `${path} L ${p.x} ${p[key]}`
    }, '')
  }

  // SVG Area path generator
  const generateAreaPath = (key: 'yVolunteers' | 'yDonations') => {
    const linePath = generatePath(key)
    const firstPoint = points[0]
    const lastPoint = points[points.length - 1]
    const bottomY = paddingTop + chartHeight
    return `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`
  }

  return (
    <div className="space-y-8">
      {isFallback && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-xs">
            <span className="font-bold">Live API Route Pending Deployment:</span> The backend endpoint <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-800/40">/api/admin/analytics</code> returned 404 on the Cloudflare Worker. Showing default baseline charts. To enable live database analytics, publish the updated Worker code to Cloudflare via <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-800/40">npx wrangler deploy</code> inside the <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[11px] dark:bg-amber-800/40">workers/</code> directory.
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Platform Analytics</h1>
          <p className="mt-1 text-sm text-brand-muted">Real-time charts auditing user traffic and donor campaigns conversion rates.</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setActiveMetric('both')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeMetric === 'both' ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-muted'
            }`}
          >
            All Insights
          </button>
          <button
            onClick={() => setActiveMetric('volunteers')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeMetric === 'volunteers' ? 'bg-[#1A3A5C] text-white' : 'text-brand-muted hover:bg-muted'
            }`}
          >
            Volunteers
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
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Total Volunteers</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">{stats?.volunteers || 0}</h3>
              </div>
              <div className="rounded-lg bg-brand-primary/5 p-3 text-brand-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span>{stats?.pendingVolunteers || 0} pending applications</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Donations Total</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">
                  ₦{((stats?.donationTotal || 0) / 100).toLocaleString()}
                </h3>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <Heart className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span>{stats?.donations || 0} total transactions</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Event Registrations</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">{stats?.events || 0} Events</h3>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span>Active campaigns</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Job Applications</p>
                <h3 className="mt-1 font-heading text-2xl font-bold">{stats?.applications || 0}</h3>
              </div>
              <div className="rounded-lg bg-orange-50 p-3 text-brand-cta">
                <Eye className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span>Across {stats?.jobs || 0} open positions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SVG Interactive Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-heading text-lg font-semibold">Volunteer & Donation Engagement Trends</h2>
            <p className="text-xs text-brand-muted">Combined visualization of monthly volunteer signups against donations.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            {(activeMetric === 'both' || activeMetric === 'volunteers') && (
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#1A3A5C]" />
                <span>Volunteers</span>
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
            <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
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
                  className="fill-brand-muted text-center text-[10px] font-semibold"
                  textAnchor="middle"
                >
                  {p.name}
                </text>
              ))}

              {/* Y Axis Left (Volunteers) */}
              {(activeMetric === 'both' || activeMetric === 'volunteers') && (
                <>
                  <text x={10} y={paddingTop - 5} className="fill-[#1A3A5C] text-[9px] font-bold">Volunteers</text>
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                    <text
                      key={`vol-${ratio}`}
                      x={paddingLeft - 10}
                      y={paddingTop + chartHeight - ratio * chartHeight}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      className="fill-[#1A3A5C] text-[9px] font-semibold"
                    >
                      {Math.round(ratio * maxVolunteers)}
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
                      {ratio === 0 ? '₦0' : `₦${((ratio * maxDonations) / 1000).toFixed(1)}k`}
                    </text>
                  ))}
                </>
              )}

              {/* Areas & Lines */}
              {/* Volunteers Area & Line */}
              {(activeMetric === 'both' || activeMetric === 'volunteers') && (
                <>
                  <path
                    d={generateAreaPath('yVolunteers')}
                    className="fill-[#1A3A5C]/5"
                  />
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8 }}
                    d={generatePath('yVolunteers')}
                    className="fill-none stroke-[#1A3A5C]"
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
                    className="fill-none stroke-[#2E7D32]"
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
                  <g key={p.name}>
                    {/* Interactive Invisible Overlay Bar for easy hovering */}
                    <rect
                      x={p.x - chartWidth / (2 * (points.length - 1))}
                      y={paddingTop}
                      width={chartWidth / (points.length - 1)}
                      height={chartHeight}
                      className="cursor-pointer fill-transparent"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />

                    {/* Volunteers Dot */}
                    {(activeMetric === 'both' || activeMetric === 'volunteers') && (
                      <circle
                        cx={p.x}
                        cy={p.yVolunteers}
                        r={isHovered ? 6 : 4}
                        className="pointer-events-none fill-[#1A3A5C] stroke-white transition-all"
                        strokeWidth="2"
                      />
                    )}

                    {/* Donations Dot */}
                    {(activeMetric === 'both' || activeMetric === 'donations') && (
                      <circle
                        cx={p.x}
                        cy={p.yDonations}
                        r={isHovered ? 6 : 4}
                        className="pointer-events-none fill-[#2E7D32] stroke-white transition-all"
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
                ref={(el) => {
                  if (el && hoveredIndex !== null && points[hoveredIndex]) {
                    const leftPercent = ((points[hoveredIndex].x - paddingLeft) / chartWidth) * 80 + 10
                    el.style.left = `${leftPercent}%`
                    el.style.top = '10%'
                  }
                }}
                className="pointer-events-none absolute z-10 space-y-1 rounded-lg border border-border bg-card p-3 text-xs text-foreground shadow-lg"
              >
                <div className="mb-1 border-b border-border pb-1 font-bold">
                  {points[hoveredIndex].name} {new Date().getFullYear()}
                </div>
                {(activeMetric === 'both' || activeMetric === 'volunteers') && (
                  <div className="flex items-center gap-1.5 text-brand-primary">
                    <span className="h-2 w-2 rounded-full bg-[#1A3A5C]" />
                    <span>
                      Volunteers: <strong>{points[hoveredIndex].volunteers.toLocaleString()}</strong>
                    </span>
                  </div>
                )}
                {(activeMetric === 'both' || activeMetric === 'donations') && (
                  <div className="flex items-center gap-1.5 text-brand-secondary">
                    <span className="h-2 w-2 rounded-full bg-[#2E7D32]" />
                    <span>
                      Donations: <strong>₦{points[hoveredIndex].donations.toLocaleString()}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

