import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { SocialShareButtons } from '@/components/public/shared/SocialShareButtons'

import Image from 'next/image'

// Mock Data
const mockPosts = [
  {
    id: '1',
    title: 'Transforming Education in Rural Communities',
    slug: 'transforming-education-rural',
    featuredImage: '/images/programs/education.png',
    content: `
      <p>Education is the cornerstone of community development. In many rural areas across Nigeria, access to quality learning remains a significant challenge. Early this year, Script Worldview Foundation launched an intensive intervention program aimed at bridging this gap.</p>
      <h2>The Challenge</h2>
      <p>Many children in these communities walk miles just to reach a school building that often lacks basic amenities. The absence of desks, books, and qualified teachers creates an environment where learning is nearly impossible.</p>
      <h2>Our Intervention</h2>
      <p>Through the generous support of our partners, we completely renovated three primary schools in Enugu State. We provided 500 new desks, distributed over 2,000 textbooks, and conducted a two-week intensive training program for 45 local teachers.</p>
      <blockquote>"The transformation is unbelievable. The students are eager to come to school now. We finally have the resources we need to teach effectively." - Mrs. Okafor, Headteacher.</blockquote>
      <h2>Looking Ahead</h2>
      <p>While we celebrate these milestones, our work is far from over. We plan to expand this initiative to five more communities before the end of the year. Your continued support makes this possible.</p>
    `,
    categoryId: 'news',
    publishedAt: new Date('2024-03-15').getTime(),
    author: { name: 'Sarah Johnson', role: 'Head of Education' },
    readTime: 4
  },
  {
    id: '3',
    title: 'Emergency Response: Flood Relief Efforts',
    slug: 'emergency-response-flood',
    featuredImage: '/images/blog/flood-relief.png',
    content: `
      <p>Heavy seasonal rains have caused unprecedented flooding across central Nigeria, displacing thousands of families and destroying vital crops. Script Worldview Foundation's Emergency Response Team has been on the ground since day one.</p>
      <h2>Immediate Action</h2>
      <p>Our priority has been the provision of clean water, emergency food rations, and temporary shelter. In collaboration with local authorities, we have established three temporary relief centers serving over 500 displaced persons.</p>
      <h2>Healthcare Interventions</h2>
      <p>Stagnant water poses a severe risk of waterborne diseases. Our medical teams are conducting daily rounds, providing essential medicines and hygiene kits to prevent outbreaks of cholera and malaria.</p>
      <blockquote>"We lost everything in the water. Without this help, we wouldn't know where to turn. The food and clean water have been a lifeline for my children." - A grateful mother at the Mangu relief center.</blockquote>
      <h2>Sustainable Recovery</h2>
      <p>As the waters recede, we are shifting our focus to long-term recovery, including helping farmers replant and assisting in the reconstruction of damaged homes.</p>
    `,
    categoryId: 'stories',
    publishedAt: new Date('2024-02-10').getTime(),
    author: { name: 'Michael Okorie', role: 'Relief Coordinator' },
    readTime: 5
  },
  {
    id: '2',
    title: 'Annual Impact Report 2023 Released',
    slug: 'annual-impact-report-2023',
    featuredImage: '/images/programs/community.png',
    content: `
      <p>The year 2023 was a year of resilience and significant growth for Script Worldview Foundation. We are proud to share our annual impact report, which details the progress we've made across all our core pillars.</p>
      <h2>Key Statistics</h2>
      <p>Over the last 12 months, we have reached 15,000 students, conducted 50 relief missions, and empowered 120 communities across Nigeria. Our financial transparency remains a top priority, with 85% of all funds going directly to program implementation.</p>
      <h2>Departmental Highlights</h2>
      <p>Our Education department saw a 20% increase in scholarship recipients, while our Humanitarian team responded to three major crises with unprecedented speed. Community development projects in Plateau State have now become self-sustaining models for other regions.</p>
    `,
    categoryId: 'reports',
    publishedAt: new Date('2024-02-28').getTime(),
    author: { name: 'David Smith', role: 'Director of Operations' },
    readTime: 6
  },
  {
    id: '4',
    title: 'The Importance of Community-Led Development',
    slug: 'importance-of-community-led-development',
    featuredImage: '/images/programs/community.png',
    content: `
      <p>Top-down development often fails because it ignores the unique nuances and wisdom of the communities it aims to serve. At Script Worldview Foundation, we believe that sustainable change must be led by the community itself.</p>
      <h2>Empowering Local Leadership</h2>
      <p>Our approach starts with listening. We work closely with traditional rulers, youth leaders, and women's cooperatives to identify their own priorities. By providing the tools and training, we enable them to take ownership of their future.</p>
      <h2>Long-Term Sustainability</h2>
      <p>When a community builds its own well or manages its own school fund, they are far more likely to maintain it. This sense of ownership is the difference between a temporary fix and a permanent transformation.</p>
    `,
    categoryId: 'op-eds',
    publishedAt: new Date('2024-01-20').getTime(),
    author: { name: 'Rev. David Chukwuma', role: 'Chief Strategist' },
    readTime: 7
  }
]

import { apiFetch } from '@/lib/api/client'

export const revalidate = 3600

async function getPostData(slug: string) {
  let post = mockPosts.find(p => p.slug === slug)

  try {
    const res = await apiFetch<any>(`/api/blog/${slug}`)
    if (res.ok && res.data) {
      const data = res.data
      post = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        featuredImage: data.featuredImage || null,
        content: data.content,
        categoryId: data.categoryId || 'news',
        publishedAt: data.publishedAt ? new Date(data.publishedAt).getTime() : new Date().getTime(),
        author: { name: 'Staff Writer', role: 'Contributor' },
        readTime: data.readTimeMinutes || 5
      }
    }
  } catch (error) {
    console.error('Failed to load blog post by slug:', error)
  }
  return post
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostData(params.slug)
  if (!post) return {}

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://scriptworldviewfoundation.org'
  const ogImage = post.featuredImage || `${APP_URL}/images/og-image.png`
  const description = post.content.replace(/<[^>]*>/g, '').substring(0, 155) + '...'

  return {
    title: `${post.title} | Script Worldview Foundation`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `${APP_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${APP_URL}/blog/${post.slug}`,
    }
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug)

  if (!post) {
    notFound()
  }

  const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  // Format schema.org markup
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    author: [{
      '@type': 'Person',
      name: post.author.name,
    }],
    description: post.content.replace(/<[^>]*>/g, '').substring(0, 155) + '...',
  }

  return (
    <article className="bg-background pb-20 pt-10">
      {/* Schema.org Organization structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        
        <Link href="/blog" className="mb-8 inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary">
            {post.categoryId}
          </div>
          <h1 className="mb-6 font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-brand-muted">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author.name}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {dateStr}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime} min read</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-2xl bg-secondary shadow-lg">
            <Image 
              src={post.featuredImage} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMWEzYTVjIi8+PC9zdmc+"
            />
          </div>
        )}
        {!post.featuredImage && (
          <div className="mb-12 aspect-[21/9] w-full rounded-2xl bg-secondary/80"></div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-brand-muted prose-headings:font-heading prose-headings:text-brand-primary prose-a:text-brand-secondary prose-blockquote:border-l-brand-secondary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer & Share */}
        <footer className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 w-full">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary font-bold text-lg">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-foreground">{post.author.name}</div>
              <div className="text-sm text-brand-muted">{post.author.role}</div>
            </div>
          </div>
          
          <div className="w-full">
            <SocialShareButtons title={post.title} />
          </div>
        </footer>

      </div>
    </article>
  )
}

