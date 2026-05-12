import { BookOpen, HeartHandshake, Users } from 'lucide-react'

export function MissionStrip() {
  return (
    <section className="bg-brand-secondary py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center space-y-4 p-6">
            <div className="rounded-full bg-white/20 p-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-heading text-xl font-bold">Education & Training</h3>
            <p className="text-white/80">
              Literacy, mentorship, and skills programs that prepare people for opportunity.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4 p-6">
            <div className="rounded-full bg-white/20 p-4">
              <HeartHandshake className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-heading text-xl font-bold">Humanitarian Response</h3>
            <p className="text-white/80">
              Rapid, coordinated support for families facing urgent needs and crisis.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 p-6">
            <div className="rounded-full bg-white/20 p-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-heading text-xl font-bold">Community Development</h3>
            <p className="text-white/80">
              Sustainable initiatives that strengthen local leadership and social cohesion.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
