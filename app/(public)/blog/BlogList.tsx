'use client';

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { BlogCard } from '@/components/public/shared/BlogCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ArrowRight, BookOpen, Clock } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  categoryId: string | null
  featuredImage: string | null
  publishedAt: number | null
  viewCount: number
  readTimeMinutes: number | null
}

interface BlogListProps {
  initialPosts: Post[]
  totalPages: number
  currentPage: number
  currentCategory: string
  currentSearch: string
}

export function BlogList({ initialPosts, totalPages, currentPage, currentCategory, currentSearch }: BlogListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(currentSearch)

  const categories = ['all', 'news', 'reports', 'stories', 'op-eds']

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (value && value !== 'all') {
      current.set(key, value)
    } else {
      current.delete(key)
    }
    // Reset page to 1 when filters change
    if (key !== 'page') current.delete('page')
    
    router.push(`${pathname}?${current.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleFilterChange('search', searchQuery)
  }

  const featuredPost = initialPosts[0]
  const gridPosts = initialPosts.slice(1)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      handleFilterChange('page', page.toString())
      window.scrollTo({ top: 400, behavior: 'smooth' })
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-8">
      {/* Search and Filter */}
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="secondary"
              className={
                currentCategory === cat
                  ? 'bg-brand-primary text-white hover:bg-brand-primary/90 capitalize rounded-full px-5'
                  : 'bg-card hover:bg-accent hover:text-accent-foreground text-muted-foreground border border-border capitalize rounded-full px-5'
              }
              onClick={() => handleFilterChange('category', cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <Input
            placeholder="Search articles..."
            className="pl-10 h-10 rounded-full border-border bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Articles Section */}
      {initialPosts.length > 0 ? (
        <div className="space-y-12">
          {/* Featured Post Card (Magazine Header style) */}
          {featuredPost && currentPage === 1 && (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card hover:shadow-cardHover transition-all duration-300"
            >
              <div className="grid gap-8 md:grid-cols-12 md:items-center">
                {/* Image panel */}
                <div className="relative h-64 sm:h-80 md:col-span-7 md:h-[400px] w-full overflow-hidden rounded-xl bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-brand-primary/5 group-hover:scale-105 transition-transform duration-700 ease-out" />
                  {/* Decorative mesh vector style illustration or category image */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 bg-[#1A3A5C]/90 text-white">
                    <div className="space-y-4 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-brand-cta opacity-80" />
                      <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        {featuredPost.categoryId || 'Featured'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Copy panel */}
                <div className="space-y-4 md:col-span-5 pr-4">
                  <div className="flex items-center gap-3 text-xs text-brand-muted">
                    <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary uppercase">
                      Featured Post
                    </span>
                    {featuredPost.publishedAt && (
                      <span>{format(new Date(featuredPost.publishedAt), 'MMMM d, yyyy')}</span>
                    )}
                  </div>

                  <h2 className="font-heading text-2xl font-extrabold text-foreground leading-tight md:text-3xl lg:text-4xl group-hover:text-brand-primary transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-sm leading-relaxed text-brand-muted line-clamp-4">
                    {featuredPost.excerpt || 'Read our latest publication and see how Script Worldview Foundation is making dynamic impacts in the community.'}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-brand-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredPost.readTimeMinutes || 5} min read
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-cta group-hover:gap-2.5 transition-all">
                      Read Article <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid Layout for rest of the posts */}
          {gridPosts.length > 0 && (
            <div className="space-y-6">
              <h3 className="font-heading text-xl font-bold text-foreground border-b border-border pb-2">
                {currentPage === 1 ? 'More Articles' : 'Recent Publications'}
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt || ''}
                    href={`/blog/${post.slug}`}
                    category={post.categoryId || 'news'}
                    publishedAt={post.publishedAt ?? undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center text-brand-muted border border-dashed border-border rounded-2xl bg-card shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-brand-muted opacity-50 mb-3" />
          <h3 className="font-heading text-lg font-bold text-foreground">No articles found</h3>
          <p className="text-sm text-brand-muted mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center border-t border-border pt-8">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              Previous
            </Button>
            <div className="flex items-center px-4 text-sm font-bold text-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
