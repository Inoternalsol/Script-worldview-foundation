import { PageHero } from '@/components/public/shared/PageHero'
import { StoryCard } from '@/components/public/shared/StoryCard'

// Mock Data
const stories = [
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

export default function StoriesPage() {
  return (
    <div>
      <PageHero
        title="Impact Stories"
        subtitle="Real stories from the individuals and communities whose lives have been transformed through our interventions."
      />

      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          {/* Masonry Grid Placeholder */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard 
                key={story.id} 
                title={story.title}
                excerpt={story.excerpt}
                href={`/stories/${story.id}`}
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
