import { BookOpen, Heart, Users, GraduationCap, Home, Utensils } from 'lucide-react'

const impacts = [
  {
    amount: 5000,
    icon: BookOpen,
    title: '₦5,000',
    impact: 'Provides school supplies for 3 children for an entire term.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    amount: 10000,
    icon: Utensils,
    title: '₦10,000',
    impact: 'Feeds a family of five with emergency food relief for 2 weeks.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    amount: 25000,
    icon: GraduationCap,
    title: '₦25,000',
    impact: 'Funds a youth leadership training workshop for 10 participants.',
    color: 'bg-green-50 text-green-600',
  },
  {
    amount: 50000,
    icon: Home,
    title: '₦50,000',
    impact: 'Sponsors a community development micro-project in a rural village.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    amount: 100000,
    icon: Users,
    title: '₦100,000',
    impact: 'Deploys a full emergency relief mission to a crisis-affected community.',
    color: 'bg-red-50 text-red-600',
  },
  {
    amount: 500000,
    icon: Heart,
    title: '₦500,000',
    impact: 'Funds a full year of scholarship for 10 underprivileged students.',
    color: 'bg-brand-primary/8 text-brand-primary',
  },
]

export function DonationImpact() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">
          Your Impact
        </div>
        <h2 className="font-heading text-3xl font-bold text-foreground">
          See What Your Gift Can Do
        </h2>
        <p className="mt-3 text-base text-brand-muted">
          Every amount matters. Here's what your contribution makes possible at Script Worldview Foundation.
        </p>
      </div>

      {/* Annual progress bar */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-foreground">2025 Annual Campaign</div>
            <div className="text-xs text-brand-muted">Goal: ₦5,000,000</div>
          </div>
          <div className="text-right">
            <div className="font-heading text-2xl font-black text-brand-primary">62%</div>
            <div className="text-xs text-brand-muted">₦3,100,000 raised</div>
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-1000"
            style={{ width: '62%' }}
          />
        </div>
        <div className="mt-2 text-xs text-brand-muted">
          1,240 donors · 86 days remaining
        </div>
      </div>

      {/* Impact per amount grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {impacts.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.amount}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-heading text-base font-bold text-foreground">{item.title}</div>
                <div className="mt-0.5 text-sm leading-snug text-brand-muted">{item.impact}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quote */}
      <blockquote className="rounded-2xl border-l-4 border-brand-primary bg-brand-primary/5 px-6 py-5">
        <p className="text-sm italic leading-relaxed text-foreground">
          "The support we received helped us rebuild our school, and today 200 children are learning in a safe, dignified environment."
        </p>
        <footer className="mt-2 text-xs font-semibold text-brand-muted">
          — Community Leader, Barkin Ladi LGA, Plateau State
        </footer>
      </blockquote>
    </div>
  )
}
