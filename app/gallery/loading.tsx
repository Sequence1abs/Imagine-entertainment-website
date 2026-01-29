import PublicLayout from "@/components/layouts/public-layout"
import { MasonrySkeleton } from "@/components/loading"

export default function GalleryLoading() {
  return (
    <PublicLayout>
      <main className="min-h-screen bg-background text-foreground">
        <section className="pt-28 pb-12 px-6 md:px-10 max-w-[1400px] mx-auto">
          <div className="max-w-[1400px] mx-auto mb-10 md:mb-16">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.15em] mb-3">
                  <span className="text-(--brand-orange)">{'//'}</span>OUR GALLERY
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight pb-2">
                  Visual <span className="italic font-normal text-muted-foreground">Highlights</span>
                </h1>
              </div>
              <div className="lg:self-end">
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  A curated collection of recent stages, shows, and extraordinary experiences we&apos;ve delivered across the globe.
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-[600px] w-full">
            <MasonrySkeleton minHeight={600} showSpinner />
          </div>
        </section>
      </main>
    </PublicLayout>
  )
}
