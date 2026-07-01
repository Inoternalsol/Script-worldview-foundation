'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Pencil, FileText, Search, Download, ShieldCheck, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { DeleteConfirmButton } from './DeleteConfirmButton'

export interface TransparencyDocument {
  id: string
  title: string
  category: 'financial_audit' | 'annual_report' | 'legal_certificate' | 'impact_report'
  fileUrl: string
  fileSize?: string
  year: number
  description?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  financial_audit: 'Annual Financial Audit',
  annual_report: 'Annual Impact Report',
  legal_certificate: '501(c)(3) / NGO Certificate',
  impact_report: 'Program Assessment / Evaluation',
}

const CATEGORY_COLORS: Record<string, string> = {
  financial_audit: 'bg-blue-100 text-blue-800 border-blue-200',
  annual_report: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  legal_certificate: 'bg-purple-100 text-purple-800 border-purple-200',
  impact_report: 'bg-amber-100 text-amber-800 border-amber-200',
}

export function TransparencyManagerClient({ initialDocs }: { initialDocs: TransparencyDocument[] }) {
  const { toast } = useToast()
  const [docs, setDocs] = useState<TransparencyDocument[]>(initialDocs)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<TransparencyDocument | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form inputs
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'financial_audit' | 'annual_report' | 'legal_certificate' | 'impact_report'>('financial_audit')
  const [fileUrl, setFileUrl] = useState('')
  const [fileSize, setFileSize] = useState('2.4 MB')
  const [year, setYear] = useState(new Date().getFullYear())
  const [description, setDescription] = useState('')

  const openNewModal = () => {
    setEditingDoc(null)
    setTitle('')
    setCategory('financial_audit')
    setFileUrl('https://scriptworldviewfoundation.org/reports/sample-audit.pdf')
    setFileSize('2.4 MB')
    setYear(new Date().getFullYear())
    setDescription('')
    setIsModalOpen(true)
  }

  const openEditModal = (doc: TransparencyDocument) => {
    setEditingDoc(doc)
    setTitle(doc.title)
    setCategory(doc.category)
    setFileUrl(doc.fileUrl)
    setFileSize(doc.fileSize || '2.4 MB')
    setYear(doc.year)
    setDescription(doc.description || '')
    setIsModalOpen(true)
  }

  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        (d.description && d.description.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory = categoryFilter ? d.category === categoryFilter : true
      return matchesSearch && matchesCategory
    })
  }, [docs, search, categoryFilter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !fileUrl || !year) {
      toast({ title: 'Missing fields', description: 'Title, File URL, and Year are required.', variant: 'destructive' })
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        title,
        category,
        fileUrl,
        fileSize: fileSize || '2.4 MB',
        year: Number(year),
        description: description || undefined,
      }

      const url = editingDoc ? `/api/admin/transparency/${editingDoc.id}` : `/api/admin/transparency`
      const method = editingDoc ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to save governance document')
      }

      const saved = await res.json()
      toast({
        title: editingDoc ? 'Document Updated' : 'Document Registered',
        description: `"${title}" is now live in the public transparency portal.`,
      })

      if (editingDoc) {
        setDocs((prev) => prev.map((d) => (d.id === editingDoc.id ? saved.data : d)))
      } else {
        setDocs((prev) => [saved.data, ...prev])
      }
      setIsModalOpen(false)
    } catch (err: any) {
      toast({ title: 'Save Error', description: err.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-brand-primary" /> Governance & Transparency Portal
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Manage annual financial audits, NGO registration certificates, tax records, and official impact evaluations.
          </p>
        </div>
        <Button onClick={openNewModal} className="bg-brand-primary text-white hover:bg-brand-primary/90 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            aria-label="Search documents"
            placeholder="Search documents by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-brand-muted" />
          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">All Categories</option>
            <option value="financial_audit">Annual Financial Audit</option>
            <option value="annual_report">Annual Impact Report</option>
            <option value="legal_certificate">501(c)(3) / NGO Certificate</option>
            <option value="impact_report">Program Assessment</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredDocs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card">
          <FileText className="mx-auto h-12 w-12 text-brand-muted opacity-40 mb-3" />
          <h3 className="font-heading font-semibold text-lg text-foreground">No governance documents found</h3>
          <p className="text-sm text-brand-muted mt-1 max-w-md mx-auto">
            Upload annual audits or registration documents to build donor confidence and compliance.
          </p>
          <Button onClick={openNewModal} variant="outline" className="mt-4">
            Upload First Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="flex flex-col justify-between rounded-xl bg-card border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${CATEGORY_COLORS[doc.category] || ''}`}>
                    {CATEGORY_LABELS[doc.category] || doc.category}
                  </span>
                  <span className="text-xs font-bold font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    FY {doc.year}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-foreground leading-snug">{doc.title}</h3>

                {doc.description && (
                  <p className="text-xs text-brand-muted line-clamp-2 mt-2 leading-relaxed">
                    {doc.description}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline"
                >
                  <Download className="h-3.5 w-3.5" /> PDF ({doc.fileSize || '2.0 MB'})
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(doc)}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-brand-primary hover:bg-brand-primary/10 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <DeleteConfirmButton
                    id={doc.id}
                    endpoint="/api/admin/transparency"
                    label="Document"
                    onSuccess={() => setDocs((prev) => prev.filter((d) => d.id !== doc.id))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isLoading && setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl border border-border overflow-y-auto max-h-[90vh]">
            <h2 className="font-heading text-lg font-bold text-foreground mb-1">
              {editingDoc ? 'Edit Governance Document' : 'Upload Governance Document'}
            </h2>
            <p className="text-xs text-brand-muted mb-6">Complete document details for public transparency portal display.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="doc-title" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Document Title *
                </label>
                <input
                  id="doc-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., 2025 Audited Financial Statements"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="doc-category" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Document Category *
                  </label>
                  <select
                    id="doc-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="financial_audit">Annual Financial Audit</option>
                    <option value="annual_report">Annual Impact Report</option>
                    <option value="legal_certificate">501(c)(3) / NGO Certificate</option>
                    <option value="impact_report">Program Assessment</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="doc-year" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Fiscal Year *
                  </label>
                  <input
                    id="doc-year"
                    type="number"
                    required
                    min="1990"
                    max="2100"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label htmlFor="doc-url" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    File URL (PDF link) *
                  </label>
                  <input
                    id="doc-url"
                    type="url"
                    required
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>

                <div>
                  <label htmlFor="doc-size" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    File Size
                  </label>
                  <input
                    id="doc-size"
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="2.4 MB"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="doc-desc" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Summary Description
                </label>
                <textarea
                  id="doc-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of key findings or certificate scope..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-brand-muted hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-brand-primary px-5 py-2 text-sm font-semibold text-white hover:bg-brand-primary/90 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : editingDoc ? 'Update Document' : 'Publish Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
