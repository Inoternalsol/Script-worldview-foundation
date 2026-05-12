import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react'

// Mock Data
const mockPost = {
  id: '1',
  title: 'Transforming Education in Rural Communities',
  slug: 'transforming-education-rural',
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
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Mock fetching
  const post = params.slug === mockPost.slug ? mockPost : null

  if (!post) {
    notFound()
  }

  const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <article className="bg-background pb-20 pt-10">
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
        <div className="mb-12 aspect-[21/9] w-full rounded-2xl bg-gray-200"></div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-brand-muted prose-headings:font-heading prose-headings:text-brand-primary prose-a:text-brand-secondary prose-blockquote:border-l-brand-secondary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer & Share */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-black/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-200"></div>
            <div>
              <div className="font-bold text-foreground">{post.author.name}</div>
              <div className="text-sm text-brand-muted">{post.author.role}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-brand-muted">Share:</span>
            <button className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-brand-primary hover:text-white transition-colors"><Facebook className="h-4 w-4" /></button>
            <button className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-brand-primary hover:text-white transition-colors"><Twitter className="h-4 w-4" /></button>
            <button className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-brand-primary hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></button>
          </div>
        </footer>

      </div>
    </article>
  )
}
