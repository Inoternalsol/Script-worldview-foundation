import { MetadataRoute } from 'next'
import { apiFetch } from '@/lib/api/client'

export const revalidate = 3600 // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swf.vercel.app'
  const now = new Date()

  // Static routes
  const publicRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/donate', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/campaigns', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/get-involved', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/volunteers', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/programs', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/programs/education', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/programs/humanitarian', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/programs/community', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/programs/capacity', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/about/leadership', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/about/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/careers', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/partners', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/gallery', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  const staticSitemap: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const dynamicSitemap: MetadataRoute.Sitemap = []

  try {
    // Fetch Blog Posts
    const blogRes = await apiFetch<any>('/api/blog')
    if (blogRes.ok && Array.isArray(blogRes.data)) {
      blogRes.data.forEach((post: any) => {
        if (post.slug && post.status === 'published') {
          dynamicSitemap.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }
      })
    }

    // Fetch Campaigns
    const campaignsRes = await apiFetch<any>('/api/campaigns')
    if (campaignsRes.ok && Array.isArray(campaignsRes.data)) {
      campaignsRes.data.forEach((camp: any) => {
        if (camp.slug && camp.status === 'active') {
          dynamicSitemap.push({
            url: `${baseUrl}/campaigns/${camp.slug}`,
            lastModified: camp.updatedAt ? new Date(camp.updatedAt) : now,
            changeFrequency: 'daily',
            priority: 0.85,
          })
        }
      })
    }
  } catch (error) {
    console.error('Failed to generate dynamic sitemap entries:', error)
  }

  return [...staticSitemap, ...dynamicSitemap]
}
