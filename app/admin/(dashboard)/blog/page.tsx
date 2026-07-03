import { adminFetch } from '@/lib/admin-api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Pencil } from 'lucide-react'
import { DeleteConfirmButton } from '@/components/admin/DeleteConfirmButton'
import { AdminTableShell, Th, EmptyRow, StatusBadge } from '@/components/admin/AdminTable'
import { BlogTableClient } from '@/components/admin/BlogTableClient'

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

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await adminFetch('/blog')
    return res.data ?? []
  } catch {
    return []
  }
}

import { Suspense } from 'react'
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton'

async function BlogLoader() {
  const posts = await getPosts()
  return <BlogTableClient posts={posts} />
}

export default function BlogAdminPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <BlogLoader />
    </Suspense>
  )
}
