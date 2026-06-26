import { PageHero } from '@/components/public/shared/PageHero'
import { StoryCard } from '@/components/public/shared/StoryCard'
import { apiFetch } from '@/lib/api/client'

// Fallback Mock Data
const fallbackStories = [
  {
    id: '1',
    title: 'From School Dropout to Software Engineer',
    excerpt: 'How our tech-inclusion program in rural Enugu gave Emeka the skills to secure a remote job.',
    location: 'Enugu State',
    program: 'Education',
    imageUrl: null
  },
  {
    id: '2',
    title: 'Rebuilding After the Floods',
    excerpt: 'The resilience of the Aje community after receiving our emergency relief packages.',
    location: 'Kogi State',
    program: 'Humanitarian',
    imageUrl: null
  },
  {
    id: '3',
    title: 'The Women\'s Cooperative that Transformed a Village',
    excerpt: 'A story of collective saving and micro-business success.',
    location: 'Osun State',
    program: 'Community',
    imageUrl: null
  }
]

export const revalidate = 3600

export default async function StoriesPage() {
  let list = fallbackStories

  try {
    const res = await apiFetch<any>('/api/blog?category=stories&status=published')
    if (res.ok && res.data && Array.isArray(res.data)) {
      if (res.data.length > 0) {
        list = res.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || '',
          location: 'Nigeria',
          program: 'Initiative',
          imageUrl: post.featuredImage || null
        }))
      }
    }
  } catch (error) {
    console.error('Failed to load stories from API:', error)
  }

  return (
    <div>
      <PageHero
        title="Impact Stories"
        subtitle="Real stories from the individuals and communities whose lives have been transformed through our interventions."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((story) => (
              <StoryCard 
                key={story.id} 
                title={story.title}
                excerpt={story.excerpt}
                href={`/blog/${story.id}`} // Or link to the blog post details directly
                location={story.location}
                tag={story.program}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

