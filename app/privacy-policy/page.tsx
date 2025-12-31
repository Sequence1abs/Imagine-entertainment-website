import Footer from "@/components/footer"

export default function PrivacyPolicy() {
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
                  Privacy <span className="italic font-normal text-muted-foreground">Policy</span>
                </span>
              </h1>
            </div>

            <div className="lg:self-end transition-all duration-700 translate-y-0 opacity-100" style={{ transitionDelay: "0.3s" }}>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                At Imagine Entertainment (Pvt) Ltd, we are committed to protecting your privacy and ensuring the security of your personal information.
              </p>
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or engage with our services.
              </p>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We may collect personal information that you provide to us voluntarily, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Contact information (Name, email address, phone number)</li>
                  <li>Project details and requirements</li>
                  <li>Communications and correspondence</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide and Improve our production services</li>
                  <li>Communicate with you regarding your projects or inquiries</li>
                  <li>Send relevant updates or marketing materials (you may opt-out at any time)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
                <p className="text-muted-foreground">
                  We may share your information with trusted third-party service providers who assist us in operating our website and conducting our business. These parties are obligated to keep your information confidential and use it only for agreed-upon purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions or concerns about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-muted rounded-xl">
                  <p className="font-medium">Imagine Entertainment (Pvt) Ltd</p>
                  <p className="text-muted-foreground">No : 97 Delkanda, Old Kesbewa Road, Nugegoda 10250, Sri Lanka.</p>
                  <p className="text-muted-foreground">Email: sales@imaginesl.com</p>
                  <p className="text-muted-foreground">Phone: +94 71 893 3514</p>
                </div>
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
