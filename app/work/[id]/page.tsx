import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import Footer from '@/components/footer'
import PublicLayout from '@/components/layouts/public-layout'
import { getEventById } from '@/lib/data/events'
import WorkGallery from '@/components/work/work-gallery'

// Fallback data for static projects (when Supabase not set up)
const fallbackProjects: Record<string, any> = {
  '1': {
    id: '1',
    title: 'BRIT AWARDS 2024',
    category: 'Television & Film',
    event_date: '2024-03-02',
    location: 'London, UK',
    cover_image_url: '/brit-awards-stage-red-lighting-production.jpg',
    event_images: [],
  },
  '2': {
    id: '2',
    title: 'LONDON FASHION WEEK',
    category: 'Corporate',
    event_date: '2024-02-15',
    location: 'London, UK',
    cover_image_url: '/fashion-runway-show-pink-dramatic-lighting.jpg',
    event_images: [],
  },
  '3': {
    id: '3',
    title: 'CORPORATE SUMMIT 2024',
    category: 'Corporate',
    event_date: '2024-01-20',
    location: 'Colombo, Sri Lanka',
    cover_image_url: '/corporate-event-stage-blue-lighting-conference.jpg',
    event_images: [],
  },
}

async function resolveEvent(id: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  if (fallbackProjects[id]) return fallbackProjects[id]
  if (isUuid) return await getEventById(id)
  return null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const event = await resolveEvent(id)
  if (!event) return { title: 'Project | Imagine Entertainment' }
  const base = 'https://www.imaginesl.com'
  const title = `${event.title} | Imagine Entertainment`
  const desc = event.location || event.category
    ? `${event.title} — ${[event.category, event.location].filter(Boolean).join(' • ')}. Produced by Imagine Entertainment, Sri Lanka's premier event production company.`
    : `${event.title}. Produced by Imagine Entertainment, Sri Lanka's premier event production company.`
  const ogImage = event.cover_image_url
    ? (event.cover_image_url.startsWith('http') ? event.cover_image_url : `${base}${event.cover_image_url.startsWith('/') ? '' : '/'}${event.cover_image_url}`)
    : `${base}/og-image.jpg`
  return {
    title,
    description: desc.slice(0, 160),
    alternates: { canonical: `/work/${id}` },
    openGraph: {
      title,
      description: desc.slice(0, 160),
      url: `${base}/work/${id}`,
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630, alt: event.title }],
    },
    twitter: { card: 'summary_large_image', title, description: desc.slice(0, 160) },
  }
}

interface WorkDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { id } = await params
  const event = await resolveEvent(id)

  if (!event) {
    notFound()
  }

  const formattedDate = event.event_date 
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <PublicLayout>
      <main className="min-h-screen bg-background">
        {/* Hero with Cover Image */}
        <section className="relative min-h-[60vh] md:min-h-[70vh] bg-foreground dark:bg-black text-white overflow-hidden flex items-end">
          <div className="absolute inset-0">
            <Image
              src={event.cover_image_url || '/placeholder.svg'}
              alt={event.title}
              fill
              className="object-cover opacity-50 dark:opacity-60"
              priority
              quality={90}
              fetchPriority="high"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-8 md:pb-10">
            {/* Back Link */}
            <Link 
              href="/work" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Work
            </Link>

            {/* Category Tag */}
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90">
                {event.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {event.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 text-white/80">
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        {event.event_images && event.event_images.length > 0 && (
          <section className="pt-8 md:pt-12 pb-16 md:pb-24 px-6 md:px-10">
            <div className="max-w-[1400px] mx-auto">
              <h2 className="text-2xl md:text-3xl font-medium mb-8">Project Gallery</h2>
              <WorkGallery images={event.event_images} />
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="mt-16 md:mt-24 py-16 md:py-24 px-6 md:px-10 bg-muted mx-4 md:mx-6 rounded-2xl text-center mb-16">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-muted-foreground text-xs tracking-[0.15em] mb-4">{'//'}Like What You See?</p>
            <h2 className="text-2xl md:text-4xl font-medium mb-6">Let&apos;s create something extraordinary</h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-lg font-medium hover:bg-foreground/90 transition-colors"
            >
              Start a Project
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </PublicLayout>
  )
}

// Generate static params for known fallback pages
export async function generateStaticParams() {
  return Object.keys(fallbackProjects).map((id) => ({ id }))
}
