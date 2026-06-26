'use client';

import { useState } from 'react'
import { PageHero } from '@/components/public/shared/PageHero'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PublicationGateForm } from '@/components/public/forms/PublicationGateForm'

// Mock Data for Publications
const publications = [
  {
    id: 1,
    title: 'The Impact of Conflict on Rural Education in Northern Nigeria',
    year: '2023',
    type: 'Research Report',
    author: 'Dr. E. Okonkwo & Research Team'
  },
  {
    id: 2,
    title: 'Sustainable Agricultural Practices for Women Cooperatives',
    year: '2022',
    type: 'Policy Brief',
    author: 'Community Dev. Dept.'
  },
  {
    id: 3,
    title: 'Assessing Post-Flood Health Vulnerabilities',
    year: '2024',
    type: 'Field Assessment',
    author: 'Humanitarian Response Team'
  }
]

export default function ResearchProgramPage() {
  const [activePubId, setActivePubId] = useState<number | null>(null);

  return (
    <div>
      <PageHero
        title="Research & Publications"
        subtitle="Generating data-driven insights and policy advocacy to drive systemic, long-term change."
      />

      <section className="bg-card py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-heading text-3xl font-bold text-brand-primary">Evidence-Based Action</h2>
            <p className="text-lg text-brand-muted">
              We believe that effective intervention must be rooted in solid evidence. Our research department conducts rigorous field studies, impact assessments, and policy analysis to guide our programs and inform national dialogue on social development.
            </p>
          </div>
        </div>
      </section>

      {/* Publications Library */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeader
            title="Publication Library"
            description="Access our reports, policy briefs, and field assessments."
          />
          
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publications.map((pub) => (
              <div key={pub.id} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-brand-secondary/10 px-3 py-1 text-xs font-semibold text-brand-secondary">
                    {pub.type}
                  </span>
                  <span className="text-sm font-medium text-brand-muted">{pub.year}</span>
                </div>
                <div className="mb-4 flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 shrink-0 text-brand-primary" />
                  <h3 className="font-heading text-lg font-bold text-foreground">{pub.title}</h3>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="mb-4 text-sm text-brand-muted">By {pub.author}</p>
                  
                  <Dialog 
                    open={activePubId === pub.id} 
                    onOpenChange={(open) => setActivePubId(open ? pub.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="w-full gap-2">
                        <Download className="h-4 w-4" /> Download PDF
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-brand-primary">Access Publication</DialogTitle>
                        <DialogDescription>
                          Unlock the publication file for direct download.
                        </DialogDescription>
                      </DialogHeader>
                      <PublicationGateForm
                        publicationTitle={pub.title}
                        downloadUrl={`/files/publications/pub-${pub.id}.pdf`}
                        onSuccess={() => setActivePubId(null)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

