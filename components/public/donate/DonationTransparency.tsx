import { BarChart3, FileText, Globe, Award } from 'lucide-react'

const pillars = [
  {
    icon: BarChart3,
    title: '98% Program Efficiency',
    description:
      'Of every ₦100 donated, ₦98 goes directly to program delivery. Only 2% covers administration — one of the lowest overhead ratios among Nigerian NGOs.',
  },
  {
    icon: FileText,
    title: 'Annual Reports Published',
    description:
      'We publish full audited financial statements every year. Every income and expense is publicly disclosed on our website and regulatory filings.',
  },
  {
    icon: Globe,
    title: 'CAC Registered & EFCC Compliant',
    description:
      'Fully registered with Nigeria\'s Corporate Affairs Commission (RC 1234567) and compliant with EFCC non-profit financial reporting requirements.',
  },
  {
    icon: Award,
    title: 'Third-Party Audited',
    description:
      'Our accounts are independently audited by a licensed accounting firm every financial year. Audit summaries are available upon request.',
  },
]

export function DonationTransparency() {
  return (
    <section className="bg-card py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-700 mb-3">
            Transparency & Accountability
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Your Trust Is Our Priority
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-brand-muted">
            We hold ourselves to the highest standards of financial transparency so you can give with complete confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-gray-50 p-6 transition-all hover:border-brand-primary/20 hover:bg-card hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10">
                <Icon className="h-5 w-5 text-brand-primary" />
              </div>
              <h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{description}</p>
            </div>
          ))}
        </div>

        {/* Financial breakdown */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-gray-50">
          <div className="border-b border-border px-6 py-4">
            <div className="font-heading text-base font-bold text-foreground">2024 Fund Allocation Breakdown</div>
          </div>
          <div className="grid divide-x divide-black/8 md:grid-cols-4">
            {[
              { label: 'Education', pct: '35%', color: 'bg-blue-500' },
              { label: 'Humanitarian', pct: '30%', color: 'bg-red-500' },
              { label: 'Community Dev.', pct: '23%', color: 'bg-green-500' },
              { label: 'Administration', pct: '12%', color: 'bg-gray-400' },
            ].map((item) => (
              <div key={item.label} className="px-6 py-5 text-center">
                <div className={`mx-auto mb-2 h-2 w-16 rounded-full ${item.color}`} />
                <div className="font-heading text-2xl font-black text-foreground">{item.pct}</div>
                <div className="text-xs text-brand-muted mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
