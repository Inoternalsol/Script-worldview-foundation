import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { BlogCard } from '@/components/public/shared/BlogCard'
import Link from 'next/link'
import { apiFetch } from '@/lib/api/client'

// Fallback Mock Data
const mockPosts = [
  {
    id: '1',
    title: 'Transforming Education in Rural Communities',
    slug: 'transforming-education-rural',
    excerpt: 'How our recent intervention in the northern communities has improved literacy rates among young girls.',
    featuredImage: null,
    categoryId: 'news',
    publishedAt: new Date('2024-03-15').getTime(),
    author: { name: 'Sarah Johnson' }
  },
  {
    id: '2',
    title: 'Annual Impact Report 2023 Released',
    slug: 'annual-impact-report-2023',
    excerpt: 'A comprehensive look at our achievements, challenges, and the communities we served over the past year.',
    featuredImage: null,
    categoryId: 'reports',
    publishedAt: new Date('2024-02-28').getTime(),
    author: { name: 'David Smith' }
  },
  {
    id: '3',
    title: 'Emergency Response: Flood Relief Efforts',
    slug: 'emergency-response-flood',
    excerpt: 'Our rapid response team has been deployed to assist families affected by the recent flooding.',
    featuredImage: null,
    categoryId: 'stories',
    publishedAt: new Date('2024-02-10').getTime(),
    author: { name: 'Michael Okorie' }
  }
]

export async function LatestNews() {
  let posts = mockPosts
  try {
    const res = await apiFetch<any>('/api/blog?status=published')
    if (res.ok && res.data && Array.isArray(res.data) && res.data.length > 0) {
      posts = res.data.slice(0, 3).map((post: any) => ({
        ...post,
        publishedAt: post.publishedAt ? new Date(post.publishedAt).getTime() : new Date().getTime()
      }))
    }
  } catch (err) {
    console.error('Failed to load latest news from API:', err)
  }

  return (
    <section className="bg-card dark:bg-slate-950 py-20 border-t border-border dark:border-white/5">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHeader
          eyebrow="Latest News"
          title="Stories of impact and progress"
          description="Stay updated with our latest initiatives, community stories, and organizational reports."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard 
              key={post.id} 
              title={post.title}
              excerpt={post.excerpt || ''}
              href={`/blog/${post.slug}`}
              category={post.categoryId || 'news'}
              publishedAt={post.publishedAt}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/blog" 
            className="inline-flex font-semibold text-brand-primary hover:text-brand-primary/80"
          >
            Read All News &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}

