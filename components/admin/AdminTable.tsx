'use client'

import { useState, useMemo, ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface AdminTableShellProps {
  title: string
  subtitle: string
  headerAction?: ReactNode
  filterBar?: ReactNode
  children: ReactNode
  /** Keys to search across (matched against row data string values) */
}

export function AdminTableShell({
  title,
  subtitle,
  headerAction,
  filterBar,
  children,
}: AdminTableShellProps) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-0.5 text-sm text-brand-muted">{subtitle}</p>
        </div>
        {headerAction}
      </div>

      {/* Filter bar */}
      {filterBar && (
        <div className="flex flex-wrap items-center gap-3">
          {filterBar}
        </div>
      )}

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

/** Reusable inline search input */
export function TableSearch({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-muted" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 pl-8 pr-8 text-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

/** Reusable select filter */
export function TableFilter({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder ?? 'Filter'}
      title={placeholder ?? 'Filter'}
      className="h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
    >
      <option value="">{placeholder ?? 'All'}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

/** Standard empty-state row */
export function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <div className="text-4xl">📭</div>
          <div className="text-sm font-medium text-foreground">{message}</div>
          <div className="text-xs text-brand-muted">Data will appear here once available.</div>
        </div>
      </td>
    </tr>
  )
}

/** Table header cell */
export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-muted/70">
      {children}
    </th>
  )
}

/** Status badge */
export function StatusBadge({ status, colorMap }: { status: string; colorMap: Record<string, string> }) {
  const cls = colorMap[status] ?? 'bg-secondary text-muted-foreground'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

/** Reusable pagination controls */
export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
  totalItems: number
}) {
  return (
    <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="relative ml-3 inline-flex items-center rounded-md border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-brand-muted">
            Showing <span className="font-medium text-foreground">{totalItems > 0 ? startIndex + 1 : 0}</span> to{' '}
            <span className="font-medium text-foreground">{Math.min(endIndex, totalItems)}</span> of{' '}
            <span className="font-medium text-foreground">{totalItems}</span> results
          </p>
        </div>
        {totalPages > 1 && (
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-brand-muted ring-1 ring-inset ring-input hover:bg-muted focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                &larr;
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1
                const isCurrent = pageNum === currentPage
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                      isCurrent
                        ? 'z-10 bg-brand-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary'
                        : 'text-foreground ring-1 ring-inset ring-input hover:bg-muted focus:outline-offset-0'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-brand-muted ring-1 ring-inset ring-input hover:bg-muted focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                &rarr;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

