import Footer from "@/components/footer"
import PublicLayout from "@/components/layouts/public-layout"
import { MasonrySkeleton } from "@/components/loading"

export default function WorkLoading() {
  return (
    <PublicLayout>
      <main className="min-h-screen bg-background flex flex-col">
        <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.15em] mb-3">
                  <span className="text-(--brand-orange)">{'//'}</span>OUR PORTFOLIO
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1]">
                  Work & <span className="italic font-normal text-muted-foreground">Projects</span>
                </h1>
              </div>
              <div className="lg:self-end">
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  Our creative playground featuring real projects and extraordinary productions across television,
                  corporate events, and theatre.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-10 pb-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-9 w-24 rounded-full bg-muted/60 animate-pulse"
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </section>

        {/* Loading between hero and CTA - same masonry skeleton as gallery */}
        <section className="flex-1 px-6 md:px-10 pb-20 md:pb-28 min-h-[40vh]" aria-live="polite" aria-busy="true">
          <MasonrySkeleton minHeight="40vh" itemCount={12} showSpinner />
        </section>

        <section className="py-20 md:py-28 bg-muted mx-4 md:mx-6 rounded-2xl text-center" aria-hidden>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <p className="text-muted-foreground text-xs tracking-[0.15em] mb-4"><span className="text-(--brand-orange)">{'//'}</span>Start a Project</p>
            <h2 className="text-2xl md:text-4xl font-medium mb-6">Have a project in mind?</h2>
            <div className="h-12 w-48 rounded-full bg-muted/60 mx-auto" />
          </div>
        </section>

        <Footer />
      </main>
    </PublicLayout>
  )
}
