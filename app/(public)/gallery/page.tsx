import { PageHero } from '@/components/public/shared/PageHero'
import { Button } from '@/components/ui/button'

export default function GalleryPage() {
  return (
    <div>
      <PageHero
        title="Media Gallery"
        subtitle="Explore photos and videos from our interventions, programs, and community events."
      />

      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            <Button variant="secondary" className="bg-brand-primary text-white hover:bg-brand-primary/90">All</Button>
            <Button variant="secondary" className="bg-white">Education</Button>
            <Button variant="secondary" className="bg-white">Humanitarian</Button>
            <Button variant="secondary" className="bg-white">Events</Button>
            <Button variant="secondary" className="bg-white">Videos</Button>
          </div>

          {/* Masonry Grid Placeholder */}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 space-y-4">
            <div className="w-full rounded-2xl bg-gray-200 aspect-video"></div>
            <div className="w-full rounded-2xl bg-gray-300 aspect-square"></div>
            <div className="w-full rounded-2xl bg-gray-200 aspect-[3/4]"></div>
            <div className="w-full rounded-2xl bg-gray-300 aspect-[4/3]"></div>
            <div className="w-full rounded-2xl bg-gray-200 aspect-square"></div>
            <div className="w-full rounded-2xl bg-gray-300 aspect-[3/4]"></div>
            <div className="w-full rounded-2xl bg-gray-200 aspect-video"></div>
          </div>

          <div className="mt-12 text-center">
            <Button variant="secondary">Load More</Button>
          </div>

        </div>
      </section>
    </div>
  )
}
