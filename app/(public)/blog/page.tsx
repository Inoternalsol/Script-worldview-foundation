import { PageHero } from '@/components/public/shared/PageHero'
import { BlogCard } from '@/components/public/shared/BlogCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

// Mock Data
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
  },
  {
    id: '4',
    title: 'The Importance of Community-Led Development',
    slug: 'importance-of-community-led-development',
    excerpt: 'Why empowering local leaders is the key to sustainable social impact in developing nations.',
    featuredImage: null,
    categoryId: 'op-eds',
    publishedAt: new Date('2024-01-20').getTime(),
    author: { name: 'Rev. David Chukwuma' }
  }
]

export default function BlogPage() {
  return (
    <div>
      <PageHero
        title="Blog & News"
        subtitle="Stories of impact, organizational updates, and thought leadership from the field."
      />

      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          
          {/* Search and Filter */}
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button variant="secondary" className="bg-brand-primary text-white hover:bg-brand-primary/90">All</Button>
              <Button variant="secondary" className="bg-white">News</Button>
              <Button variant="secondary" className="bg-white">Reports</Button>
              <Button variant="secondary" className="bg-white">Stories</Button>
              <Button variant="secondary" className="bg-white">Op-Eds</Button>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search articles..." className="pl-9" />
            </div>
          </div>

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockPosts.map((post) => (
              <BlogCard 
                key={post.id} 
                title={post.title}
                excerpt={post.excerpt}
                href={`/blog/${post.slug}`}
                category={post.categoryId}
                publishedAt={post.publishedAt}
              />
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              <Button variant="secondary" disabled>Previous</Button>
              <Button variant="secondary">Next</Button>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
