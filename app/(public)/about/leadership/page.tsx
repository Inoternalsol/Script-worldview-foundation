import { PageHero } from '@/components/public/shared/PageHero'
import { SectionHeader } from '@/components/public/shared/SectionHeader'
import { TeamMemberCard } from '@/components/public/shared/TeamMemberCard'
import Image from 'next/image'
import { apiFetch } from '@/lib/api/client'

// Fallback Mock Data
const fallbackBoard = [
  {
    id: '1',
    name: 'Dr. Emmanuel Okonkwo',
    role: 'Chairman, Board of Trustees',
    bio: 'Over 30 years of experience in educational leadership and policy advocacy.',
    imageUrl: null
  },
  {
    id: '2',
    name: 'Mrs. Amina Yusuf',
    role: 'Vice Chair',
    bio: 'Renowned humanitarian and advocate for women empowerment.',
    imageUrl: null
  },
  {
    id: '3',
    name: 'Prof. Samuel Adebayo',
    role: 'Board Member',
    bio: 'Professor of Sociology specializing in community development.',
    imageUrl: null
  }
]

const fallbackExecutive = {
  name: 'Rev. David Chukwuma',
  role: 'Executive Director',
  bio: 'David leads the foundation with a passion for transformative education and faith-driven humanitarian service. Under his leadership, the organization has expanded its reach to 12 communities nationwide.',
  imageUrl: '/images/team-staff1.png'
}

const fallbackTeam = [
  {
    id: '4',
    name: 'Sarah Johnson',
    role: 'Head of Education',
    bio: 'Passionate about early childhood education and literacy programs.',
    imageUrl: null
  },
  {
    id: '5',
    name: 'Michael Okorie',
    role: 'Head of Humanitarian Relief',
    bio: 'Experienced in rapid crisis response and supply chain logistics.',
    imageUrl: null
  },
  {
    id: '6',
    name: 'Grace O.',
    role: 'Head of Community Dev.',
    bio: 'Specializes in peacebuilding and local capacity strengthening.',
    imageUrl: null
  }
]

export const revalidate = 60

export default async function LeadershipPage() {
  let board = fallbackBoard
  let executive = fallbackExecutive
  let team = fallbackTeam

  try {
    const res = await apiFetch<any>('/api/team')
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      const allMembers = res.data
      const execs = allMembers.filter((m: any) => m.category === 'executive')
      const boards = allMembers.filter((m: any) => m.category === 'board')
      const leads = allMembers.filter((m: any) => m.category === 'volunteer_lead')

      if (execs.length > 0) {
        executive = {
          name: execs[0].name,
          role: execs[0].role,
          bio: execs[0].bio || '',
          imageUrl: execs[0].photoUrl || '/images/team-staff1.png',
        }
      }
      if (boards.length > 0) {
        board = boards.map((m: any) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          bio: m.bio || '',
          imageUrl: m.photoUrl || `https://avatar.vercel.sh/${encodeURIComponent(m.name)}`,
        }))
      }
      if (leads.length > 0) {
        team = leads.map((m: any) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          bio: m.bio || '',
          imageUrl: m.photoUrl || `https://avatar.vercel.sh/${encodeURIComponent(m.name)}`,
        }))
      }
    }
  } catch (error) {
    console.error('Failed to load live team data from API:', error)
  }

  return (
    <div>
      <PageHero
        title="Our Leadership"
        subtitle="Meet the dedicated individuals guiding our mission to shape minds and transform communities."
      />

      {/* Executive Director */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/80">
              <Image
                src={executive.imageUrl}
                alt={executive.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div>
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-secondary">
                Executive Director
              </div>
              <h2 className="mb-4 font-heading text-4xl font-bold text-brand-primary">
                {executive.name}
              </h2>
              <p className="text-lg leading-relaxed text-brand-muted">
                {executive.bio}
              </p>
              <div className="mt-8 font-accent text-xl italic text-foreground">
                "Our vision is to build communities where every individual has the opportunity to thrive, supported by a foundation of education and dignity."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Trustees */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeader
            title="Board of Trustees"
            description="Our board provides strategic direction and ensures the highest standards of governance and accountability."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {board.map((member) => (
              <TeamMemberCard 
                key={member.id} 
                name={member.name}
                title={member.role}
                imageUrl={member.imageUrl ?? "https://avatar.vercel.sh/" + member.name}
                bio={member.bio}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <SectionHeader
            title="Department Heads"
            description="The dedicated professionals leading our daily operations and programmatic impact."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamMemberCard 
                key={member.id} 
                name={member.name}
                title={member.role}
                imageUrl={member.imageUrl ?? "https://avatar.vercel.sh/" + member.name}
                bio={member.bio}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
