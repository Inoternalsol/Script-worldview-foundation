import React from 'react'
import { PageHero } from '@/components/public/shared/PageHero'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { FileText, Download, ShieldCheck, CheckCircle2, Award, Calendar, ExternalLink } from 'lucide-react'
import { apiFetch } from '@/lib/api/client'
import { TransparencyDocument } from '@/components/admin/TransparencyManagerClient'

async function getGovernanceDocs(): Promise<TransparencyDocument[]> {
  try {
    const res = await apiFetch<{ ok: boolean; data: TransparencyDocument[] }>('/api/transparency')
    if (res.ok && res.data?.data) {
      return res.data.data
    }
    return []
  } catch {
    return []
  }
}

const CATEGORY_TITLES: Record<string, { title: string; subtitle: string; icon: any }> = {
  financial_audit: {
    title: 'Audited Financial Statements',
    subtitle: 'Independent annual accounting audits conducted by certified public accounting firms ensuring complete financial accountability.',
    icon: Award,
  },
  annual_report: {
    title: 'Annual Impact & Program Reports',
    subtitle: 'Comprehensive yearly evaluations of our humanitarian reaches, educational transformations, and rural community initiatives.',
    icon: FileText,
  },
  legal_certificate: {
    title: 'Legal Registration & Exemption Certificates',
    subtitle: 'Official corporate registration, tax exemption compliance documentation, and governmental authorization certificates.',
    icon: ShieldCheck,
  },
  impact_report: {
    title: 'Program Assessments & Field Studies',
    subtitle: 'Detailed third-party evaluations monitoring programmatic outcomes and quantitative socio-economic impacts.',
    icon: CheckCircle2,
  },
}

export const metadata = {
  title: 'Governance & Institutional Transparency | Script Worldview Foundation',
  description: 'Explore our audited financial reports, 501(c)(3) NGO compliance certificates, annual impact evaluations, and organizational governance commitments.',
}

export default async function TransparencyPublicPage() {
  const docs = await getGovernanceDocs()

  // Group by category
  const docsByCategory = docs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = []
    acc[doc.category].push(doc)
    return acc
  }, {} as Record<string, TransparencyDocument[]>)

  const categories = ['financial_audit', 'annual_report', 'legal_certificate', 'impact_report']

  return (
    <div className="bg-background">
      <PageHero
        title="Institutional Transparency & Governance"
        subtitle="We operate with uncompromising integrity and complete open-book accountability to our donors, institutional partners, and the communities we serve."
        backgroundImage="/images/about-hero.png"
      />

      {/* Institutional Trust Pledge */}
      <section className="py-16 border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-4">
            <ShieldCheck className="h-4 w-4" /> Donor Accountability Pledge
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Stewardship You Can Verify
          </h2>
          <p className="mt-4 text-brand-muted max-w-3xl mx-auto leading-relaxed text-base">
            At Script Worldview Foundation, every dollar invested in educational transformation and community aid is tracked, audited, and deployed with rigorous financial controls. We adhere to global best practices in nonprofit governance.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="font-heading font-bold text-lg text-brand-primary">100% Program Allocation</div>
              <p className="mt-2 text-xs text-brand-muted leading-relaxed">
                Dedicated institutional grant funding goes directly toward educational resources, infrastructure, and field operations.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="font-heading font-bold text-lg text-brand-primary">Annual Independent Audits</div>
              <p className="mt-2 text-xs text-brand-muted leading-relaxed">
                Our books are independently audited every fiscal year by certified external accounting partners to guarantee accuracy.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="font-heading font-bold text-lg text-brand-primary">Statutory Compliance</div>
              <p className="mt-2 text-xs text-brand-muted leading-relaxed">
                Fully registered as an incorporated trustee and non-governmental organization adhering strictly to national regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Document Library Sections */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-16">
          {categories.map((catKey) => {
            const catInfo = CATEGORY_TITLES[catKey] || {
              title: catKey,
              subtitle: 'Official governance documents.',
              icon: FileText,
            }
            const Icon = catInfo.icon
            const categoryDocs = docsByCategory[catKey] || []

            return (
              <div key={catKey} className="space-y-6">
                <div className="border-b border-border pb-4 flex items-start gap-4">
                  <div className="rounded-xl bg-brand-primary/10 p-3 text-brand-primary shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-foreground">{catInfo.title}</h3>
                    <p className="text-sm text-brand-muted mt-1">{catInfo.subtitle}</p>
                  </div>
                </div>

                {categoryDocs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center bg-card/50">
                    <p className="text-xs text-brand-muted italic">
                      Current fiscal year documents for this category are undergoing publication review and will be posted shortly.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col justify-between rounded-xl bg-card border border-border p-6 shadow-sm hover:shadow-md transition-all hover:border-brand-primary/40 group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 rounded bg-muted px-2.5 py-1 text-xs font-bold font-mono text-foreground">
                              <Calendar className="h-3 w-3 text-brand-primary" /> FY {doc.year}
                            </span>
                            <span className="text-[11px] font-semibold text-brand-muted">
                              PDF Document
                            </span>
                          </div>

                          <h4 className="font-heading font-bold text-base text-foreground group-hover:text-brand-primary transition-colors leading-snug">
                            {doc.title}
                          </h4>

                          {doc.description && (
                            <p className="text-xs text-brand-muted line-clamp-3 mt-2.5 leading-relaxed">
                              {doc.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-xs font-medium text-brand-muted">
                            {doc.fileSize || '2.4 MB'}
                          </span>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary/10 px-3 py-1.5 text-xs font-semibold text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                          >
                            <Download className="h-3.5 w-3.5" /> View Report
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
