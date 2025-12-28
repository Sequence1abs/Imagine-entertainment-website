import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import Footer from '@/components/footer'
import PublicLayout from '@/components/layouts/public-layout'
import { getEventById } from '@/lib/data/events'

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

interface WorkDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { id } = await params
  
  // Try to fetch from Supabase first, fall back to static data
  let event = await getEventById(id)
  
  if (!event) {
    // Check fallback data
    event = fallbackProjects[id]
  }
  
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
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-16 md:pb-20">
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
          <section className="py-16 md:py-24 px-6 md:px-10">
            <div className="max-w-[1400px] mx-auto">
              <h2 className="text-2xl md:text-3xl font-medium mb-8">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {event.event_images.map((image: any) => (
                  <div key={image.id} className="relative aspect-4/3 rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || event.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-6 md:px-10 bg-muted mx-4 md:mx-6 rounded-2xl text-center mb-16">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-muted-foreground text-xs tracking-[0.15em] mb-4">//Like What You See?</p>
            <h2 className="text-2xl md:text-4xl font-medium mb-6">Let's create something extraordinary</h2>
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
