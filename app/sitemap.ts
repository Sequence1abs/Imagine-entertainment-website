import { MetadataRoute } from 'next'
import { getPublishedEvents } from '@/lib/data/events'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.imaginesl.com'

const staticPages: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  { url: `${BASE_URL}/terms-of-use`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const workUrls: MetadataRoute.Sitemap = []
  try {
    const events = await getPublishedEvents()
    for (const e of events) {
      workUrls.push({
        url: `${BASE_URL}/work/${e.id}`,
        lastModified: e.updated_at ? new Date(e.updated_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  } catch {
    // Fallback: include static work detail IDs used when Supabase is unavailable
    for (const id of ['1', '2', '3']) {
      workUrls.push({
        url: `${BASE_URL}/work/${id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }
  return [...staticPages, ...workUrls]
}
