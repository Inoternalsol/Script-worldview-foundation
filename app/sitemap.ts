import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swf.vercel.app'
  const now = new Date()

  // Define our 22 public routes with respective search priority weights
  const publicRoutes = [
    // 1. Core Landing
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },

    // 2. High-Priority Action Gateways
    { path: '/donate', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/campaigns', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/get-involved', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/volunteers', priority: 0.9, changeFrequency: 'weekly' as const },

    // 3. Key Impact Pillars
    { path: '/programs', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/programs/education', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/programs/humanitarian', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/programs/community', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/programs/capacity', priority: 0.8, changeFrequency: 'weekly' as const },

    // 4. Identity & Resources
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/about/leadership', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/about/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'daily' as const },
    { path: '/careers', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/partners', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/gallery', priority: 0.7, changeFrequency: 'weekly' as const },

    // 5. Legal Compliance
    { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
