import { PageHero } from '@/components/public/shared/PageHero'
import { BlogList } from './BlogList'
import { apiFetch } from '@/lib/api/client'

// Fallback Data in case the backend database is completely empty or server is offline
const fallbackPosts = [
  {
    id: '1',
    title: 'Transforming Education in Rural Communities',
    slug: 'transforming-education-rural',
    content: '',
    excerpt: 'How our recent intervention in the northern communities has improved literacy rates among young girls.',
    featuredImage: '/images/programs/education.png',
    categoryId: 'news',
    publishedAt: new Date('2024-03-15').getTime(),
    viewCount: 0,
    readTimeMinutes: 4,
  },
  {
    id: '2',
    title: 'Annual Impact Report 2023 Released',
    slug: 'annual-impact-report-2023',
    content: '',
    excerpt: 'A comprehensive look at our achievements, challenges, and the communities we served over the past year.',
    featuredImage: null,
    categoryId: 'reports',
    publishedAt: new Date('2024-02-28').getTime(),
    viewCount: 0,
    readTimeMinutes: 6,
  },
  {
    id: '3',
    title: 'Emergency Response: Flood Relief Efforts',
    slug: 'emergency-response-flood',
    content: '',
    excerpt: 'Our rapid response team has been deployed to assist families affected by the recent flooding.',
    featuredImage: '/images/blog/flood-relief.png',
    categoryId: 'stories',
    publishedAt: new Date('2024-02-10').getTime(),
    viewCount: 0,
    readTimeMinutes: 5,
  },
  {
    id: '4',
    title: 'The Importance of Community-Led Development',
    slug: 'importance-of-community-led-development',
    content: '',
    excerpt: 'Why empowering local leaders is the key to sustainable social impact in developing nations.',
    featuredImage: null,
    categoryId: 'op-eds',
    publishedAt: new Date('2024-01-20').getTime(),
    viewCount: 0,
    readTimeMinutes: 7,
  }
]

export const revalidate = 3600 // Cache and statically regenerate page at most once per hour

export default async function BlogPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  let posts = fallbackPosts
  let totalPages = 1
  
  const page = typeof searchParams.page === 'string' ? searchParams.page : '1'
  const category = typeof searchParams.category === 'string' ? searchParams.category : 'all'
  const search = typeof searchParams.search === 'string' ? searchParams.search : ''

  try {
    const query = new URLSearchParams()
    query.set('status', 'published')
    query.set('page', page)
    if (category !== 'all') query.set('category', category)
    if (search) query.set('search', search)

    const res = await apiFetch<any>(`/api/blog?${query.toString()}`)
    if (res.ok && res.data && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        posts = res.data.map((post: any) => ({
          ...post,
          publishedAt: post.publishedAt ? new Date(post.publishedAt).getTime() : null
        }))
        totalPages = (res as any).meta?.totalPages || 1
      }
    }
  } catch (error) {
    console.error('Failed to load blog posts from API:', error)
  }

  return (
    <div>
      <PageHero
        title="Blog & News"
        subtitle="Stories of impact, organizational updates, and thought leadership from the field."
      />

      <section className="bg-background py-12">
        <BlogList 
          initialPosts={posts} 
          totalPages={totalPages} 
          currentPage={parseInt(page, 10)} 
          currentCategory={category} 
          currentSearch={search} 
        />
      </section>
    </div>
  )
}

