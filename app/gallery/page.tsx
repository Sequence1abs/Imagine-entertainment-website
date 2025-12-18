"use client"

import Image from "next/image"

const galleryItems = [
  "/brit-awards-stage-red-lighting-production.jpg",
  "/fashion-runway-show-pink-dramatic-lighting.jpg",
  "/corporate-event-stage-blue-lighting-conference.jpg",
  "/theatre-stage-dramatic-spotlight-performance.jpg",
  "/dramatic-stage-lighting-corporate-event-dark-green.jpg",
  "/professional-event-production-team-working-stage-s.jpg",
  "/tech-product-launch-event-modern-minimal.jpg",
  "/music-festival-outdoor-stage-crowd-night-lights.jpg",
  "/theatre-stage-lights-performance.jpg",
  "/behind-the-scenes-event-production-crew-working-ba.jpg",
  "/awards-show-stage-red-carpet-dramatic-lighting.jpg",
  "/corporate-event-stage-lighting.jpg",
]

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="pt-28 pb-12 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-10">
          <p className="text-xs tracking-[0.15em] text-muted-foreground mb-3">//Gallery</p>
          <h1 className="text-3xl md:text-4xl font-medium mb-4">Visual Highlights</h1>
          <p className="text-muted-foreground">
            A Pinterest-style wall of recent stages, shows, and experiences we’ve delivered.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {galleryItems.map((src, idx) => (
            <div key={src + idx} className="overflow-hidden rounded-xl break-inside-avoid group shadow-sm">
              <div className="relative w-full h-auto block">
                <Image
                  src={src}
                  alt="Imagine Entertainment gallery item"
                  width={1200}
                  height={1600}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={idx < 4}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

