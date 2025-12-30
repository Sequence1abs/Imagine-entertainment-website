"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// Media & Hotels
const clients = [
  { abbr: "HIR", name: "Hiru TV", image: "Hiru_TV-Logo1.png" },
  { abbr: "DER", name: "TV Derana", image: "TV_Derana_Logo.png" },
  { abbr: "SIR", name: "Sirasa TV", image: "Sirasa_TV_Logo.png" },
  { abbr: "SWA", name: "Swarnavahini", image: "swarnavahini.png" },
  { abbr: "ITN", name: "ITN", image: "ITN_Television_Logo_of_Sri_lanka.png" },
  { abbr: "RUP", name: "Rupavahini", image: "Logo_of_Sri_Lanka_Rupavahini_Corporation.png" },
  { abbr: "WE", name: "Waters Edge", image: "waters-edge.png" },
  { abbr: "HIL", name: "Hilton", image: "hilton-logo.png" },
  { abbr: "KIN", name: "The Kingsbury", image: "the-kingsbury.png" },
  { abbr: "TAJ", name: "Taj Samudra", image: "taj-samudra.png" },
  { abbr: "SHA", name: "Shangri-La", image: "shangri-la.png" },
  { abbr: "MLH", name: "Mount Lavinia", image: "mount-lavinia-hotel.png" },
  { abbr: "GFH", name: "Galle Face", image: "galle-face-hotel.png" },
  { abbr: "AVN", name: "Avenra", image: "avenra.png" },
]

// Corporate
const clients2 = [
  { abbr: "PB", name: "People's Bank", image: "peoples-bank.png" },
  { abbr: "SB", name: "Sampath Bank", image: "sampath-bank.png" },
  { abbr: "BOC", name: "BOC", image: "boc.png" },
  { abbr: "COM", name: "Commercial Bank", image: "commercial-bank.png" },
  { abbr: "HNB", name: "HNB", image: "hnb.png" },
  { abbr: "SIN", name: "Singer", image: "singer.png" },
  { abbr: "UBR", name: "Uber", image: "uber.png" },
  { abbr: "FLO", name: "Flora", image: "flora.png" },
  { abbr: "UL", name: "Unilever", image: "unilever.png" },
  { abbr: "NYSC", name: "Sri Lanka Youth", image: "sri-lanka-youth.png" },
  { abbr: "JANA", name: "Janashakti", image: "janashakti.png" },
  { abbr: "DIA", name: "Dialog", image: "dialog.png" },
  { abbr: "BRX", name: "Brandix", image: "brandix.png" },
  { abbr: "FON", name: "Fonterra", image: "fonterra.png" },
  { abbr: "IESL", name: "IESL", image: "iesl.png" },
  { abbr: "SLIC", name: "Sri Lanka Ins.", image: "sri-lanka-insurance.png" },
  { abbr: "LOLC", name: "LOLC", image: "lolc.png" },
  { abbr: "CGTTI", name: "German Tech", image: "cgtti.png" },
  { abbr: "RAI", name: "Raigam", image: "raigam.png" },
  { abbr: "LION", name: "Lions Club", image: "lions-club.png" },
  { abbr: "SLT", name: "SLT Mobitel", image: "slt.png" },
  { abbr: "SLA", name: "SriLankan", image: "srilankan-airlines.png" },
  { abbr: "NES", name: "Nestle", image: "nestle.png" },
  { abbr: "DP", name: "DP Education", image: "dp-education.png" },
]

export default function ClientsMarquee() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 md:py-28 overflow-hidden" suppressHydrationWarning>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-12" suppressHydrationWarning>
        <p
          className={`text-muted-foreground text-xs tracking-[0.2em] text-center mb-4 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          //TRUSTED BY
        </p>
        <h2
          className={`text-3xl md:text-4xl lg:text-5xl font-medium text-center transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
        >
          Industry-Leading
          <br />
          <span className="italic font-normal text-muted-foreground">Brands & Organizations</span>
        </h2>
      </div>

      {/* Row 1 - scroll left */}
      <div className="relative mb-4 marquee-mask" suppressHydrationWarning>
        <div className="flex animate-marquee" suppressHydrationWarning>
          {[...clients, ...clients, ...clients].map((client, index) => (
            <ClientCard key={`row1-${index}`} client={client} />
          ))}
        </div>
      </div>

      {/* Row 2 - scroll right */}
      <div className="relative marquee-mask" suppressHydrationWarning>
        <div className="flex animate-marquee-reverse" suppressHydrationWarning>
          {[...clients2, ...clients2, ...clients2].map((client, index) => (
            <ClientCard key={`row2-${index}`} client={client} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ClientCard({ client }: { client: { abbr: string; name: string; image?: string } }) {
  return (
    <div className="flex-shrink-0 px-3 md:px-5" suppressHydrationWarning>
      <div className="flex items-center justify-center h-20 md:h-24" suppressHydrationWarning>
        {client.image ? (
          <div className="relative w-28 h-14 md:w-40 md:h-20 transition-transform duration-300 hover:scale-110">
            <Image
              src={`/brands/${client.image}`}
              alt={`${client.name} Logo`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 112px, 160px"
            />
          </div>
        ) : (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted/20 flex items-center justify-center border border-white/10">
            <span className="text-xs md:text-sm font-bold text-muted-foreground/50">{client.abbr}</span>
          </div>
        )}
      </div>
    </div>
  )
}
