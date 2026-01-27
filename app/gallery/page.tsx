import { Suspense } from "react"
import { getAllGalleryImages } from "@/lib/data/events"
import GalleryClient from "./gallery-client"
import PublicLayout from "@/components/layouts/public-layout"

// Server component - fetches data on server for faster initial load
export const revalidate = 3600 // Revalidate every hour

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default async function GalleryPage() {
  // Fetch images on the server (eliminates client-side fetch waterfall)
  let images: string[] = []
  
  try {
    const allImages = await getAllGalleryImages()
    if (allImages && allImages.length > 0) {
      // Shuffle images for variety
      images = shuffleArray(allImages)
    }
  } catch (error) {
    console.error('Error fetching gallery images:', error)
  }

  return (
    <PublicLayout>
      <main className="min-h-screen bg-background text-foreground">
        <section className="pt-28 pb-12 px-6 md:px-10 max-w-[1400px] mx-auto">
          <div className="max-w-[1400px] mx-auto mb-10 md:mb-16">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
              <div>
                <div className="overflow-hidden mb-3">
                  <p className="text-muted-foreground text-xs tracking-[0.15em]">
                    <span className="text-(--brand-orange)">{'//'}</span>OUR GALLERY
                  </p>
                </div>
                <h1 className="overflow-hidden pb-2">
                  <span className="block text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
                    Visual <span className="italic font-normal text-muted-foreground">Highlights</span>
                  </span>
                </h1>
              </div>

              <div className="lg:self-end">
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  A curated collection of recent stages, shows, and extraordinary experiences we&apos;ve delivered across the globe.
                </p>
              </div>
            </div>
          </div>

          <Suspense fallback={
            <div className="min-h-[600px] flex items-center justify-center">
              <div className="text-muted-foreground">Loading gallery...</div>
            </div>
          }>
            <GalleryClient initialImages={images} />
          </Suspense>
        </section>
      </main>
    </PublicLayout>
  )
}
