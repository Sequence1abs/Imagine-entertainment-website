import Footer from "@/components/footer"

export default function TermsOfUse() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 mb-16">
            <div>
              <div className="overflow-hidden mb-3">
                <p className="text-muted-foreground text-xs tracking-[0.15em] transition-all duration-700 translate-y-0 opacity-100">
                  LEGAL
                </p>
              </div>
              <h1 className="overflow-hidden pb-2">
                <span className="block text-4xl md:text-5xl lg:text-6xl font-medium leading-tight transition-all duration-700 translate-y-0 opacity-100" style={{ transitionDelay: "0.15s" }}>
                  Terms of <span className="italic font-normal text-muted-foreground">Use</span>
                </span>
              </h1>
            </div>

            <div className="lg:self-end transition-all duration-700 translate-y-0 opacity-100" style={{ transitionDelay: "0.3s" }}>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Welcome to Imagine Entertainment (Pvt) Ltd. By accessing our website and using our services, you agree to comply with these terms.
              </p>
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using this website, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The content, design, and intellectual property contained on this website are owned by or licensed to Imagine Entertainment (Pvt) Ltd. This includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Use of Services</h2>
                <p className="text-muted-foreground mb-4">
                  Our services are intended for legitimate business purposes. You agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Use our website or services for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the integrity or performance of our website</li>
                  <li>Transmit any harmful code or malware</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  Imagine Entertainment (Pvt) Ltd shall not be liable for any direct, indirect, incidental, consequential, to punitive damages arising out of your access to or use of this website. We make no warranties or representations about the accuracy or completeness of this site&apos;s content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms and conditions are governed by and construed in accordance with the laws of Sri Lanka and the United Kingdom, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time without prior notice. By continuing to use the website after such changes, you agree to be bound by the revised terms.
                </p>
              </section>

              <div className="pt-8 border-t border-border mt-12">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
