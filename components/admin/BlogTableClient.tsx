'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Pencil } from 'lucide-react'
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton'
import { AdminTableShell, TableSearch, TableFilter, Th, EmptyRow, StatusBadge, TablePagination } from '@/components/admin/AdminTable'

type BlogPost = {
  id: string
  title: string
  slug: string
  status: string
  categoryId: string | null
  viewCount: number
  publishedAt: string | number | null
  createdAt: string | number
}

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft:     'bg-amber-100 text-amber-700',
  archived:  'bg-secondary text-muted-foreground',
}

export function BlogTableClient({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() =>
    posts.filter((p) => {
      const q = search.toLowerCase()
      return (
        (!search || p.title.toLowerCase().includes(q) || (p.categoryId ?? '').toLowerCase().includes(q)) &&
        (!statusFilter || p.status === statusFilter)
      )
    }), [posts, search, statusFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginated = useMemo(() => {
    return filtered.slice(startIndex, endIndex)
  }, [filtered, startIndex, endIndex])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <AdminTableShell
      title="Blog Posts"
      subtitle={`${posts.length} post${posts.length !== 1 ? 's' : ''}`}
      headerAction={
        <Button asChild variant="cta">
          <Link href="/admin/blog/new"><Plus className="mr-2 h-4 w-4" />New Post</Link>
        </Button>
      }
      filterBar={
        <>
          <TableSearch value={search} onChange={setSearch} placeholder="Search posts…" />
          <TableFilter
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Statuses"
            options={[
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archived', value: 'archived' },
            ]}
          />
        </>
      }
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            <Th>Title</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Views</Th>
            <Th>Created</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <EmptyRow colSpan={6} message="No blog posts found." />
          ) : (
            paginated.map((post) => (
              <tr key={post.id} className="border-b border-border transition-colors hover:bg-muted/40">
                <td className="max-w-[280px] truncate px-4 py-3 font-medium text-foreground" title={post.title}>
                  {post.title}
                </td>
                <td className="px-4 py-3 capitalize text-brand-muted">{post.categoryId || '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={post.status} colorMap={STATUS_COLORS} />
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.viewCount}</span>
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-brand-primary hover:bg-brand-primary/8 transition-colors"
                    >
                      <Pencil className="h-3 w-3" />Edit
                    </Link>
                    <DeleteConfirmButton
                      id={post.id}
                      endpoint="/api/admin/blog"
                      label="Post"
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filtered.length}
      />
    </AdminTableShell>
  )
}

