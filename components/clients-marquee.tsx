"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"

// Combined Clients List (42 total)
const clients = [
  // Named Files
  { abbr: "CGTTI", name: "Ceylon German Technical Training Institute", image: "CGTTI.png" },
  { abbr: "HNB", name: "Hatton National Bank", image: "HNB.png" },
  { abbr: "JANA", name: "Janashakthi Insurance", image: "Janashakthi.png" },

  // Media & Hotels (Mapped to Asset sequence 128-141)
  { abbr: "HIR", name: "Hiru TV", image: "Asset 128@3x.webp" },
  { abbr: "DER", name: "TV Derana", image: "Asset 129@3x.webp" },
  { abbr: "SIR", name: "Sirasa TV", image: "Asset 130@3x.webp" },
  { abbr: "SWA", name: "Swarnavahini", image: "Asset 131@3x.webp" },
  { abbr: "ITN", name: "ITN", image: "Asset 132@3x.webp" },
  { abbr: "RUP", name: "Rupavahini", image: "Asset 133@3x.webp" },
  { abbr: "WE", name: "Waters Edge", image: "Asset 134@3x.webp" },
  { abbr: "HIL", name: "Hilton", image: "Asset 136@3x.webp" }, // 135 missing, shifted to 136
  { abbr: "KIN", name: "The Kingsbury", image: "Asset 137@3x.webp" },
  { abbr: "TAJ", name: "Taj Samudra", image: "Asset 138@3x.webp" },
  { abbr: "SHA", name: "Shangri-La", image: "Asset 139@3x.webp" },
  { abbr: "MLH", name: "Mount Lavinia", image: "Asset 140@3x.webp" },
  { abbr: "GFH", name: "Galle Face", image: "Asset 141@3x.webp" },
  { abbr: "AVN", name: "Avenra", image: "Asset 142@3x.webp" },

  // Corporate (Mapped to Asset sequence 143-168)
  { abbr: "PB", name: "People's Bank", image: "Asset 143@3x.webp" },
  { abbr: "SB", name: "Sampath Bank", image: "Asset 144@3x.webp" },
  { abbr: "BOC", name: "Bank of Ceylon", image: "Asset 145@3x.webp" },
  { abbr: "COM", name: "Commercial Bank", image: "Asset 146@3x.webp" },
  // HNB is named above
  { abbr: "SIN", name: "Singer", image: "Asset 147@3x.webp" },
  { abbr: "UBR", name: "Uber", image: "Asset 148@3x.webp" },
  // 149 missing (Sri Lanka Youth) -> Mapped to next available or named?
  { abbr: "FLO", name: "Flora", image: "Asset 150@3x.webp" },
  { abbr: "UL", name: "Unilever", image: "Asset 151@3x.webp" },
  { abbr: "SLY", name: "Sri Lanka Youth", image: "Asset 152@3x.webp" },
  // Janashakthi named above
  { abbr: "DIA", name: "Dialog", image: "Asset 153@3x.webp" },
  { abbr: "BRX", name: "Brandix", image: "Asset 154@3x.webp" },
  { abbr: "FON", name: "Fonterra", image: "Asset 155@3x.webp" },
  { abbr: "IESL", name: "IESL", image: "Asset 156@3x.webp" },
  { abbr: "SLIC", name: "Sri Lanka Insurance", image: "Asset 157@3x.webp" },
  { abbr: "LOLC", name: "LOLC", image: "Asset 158@3x.webp" },
  // German Tech (CGTTI) named above
  { abbr: "RAI", name: "Raigam", image: "Asset 159@3x.webp" },
  { abbr: "LION", name: "Lions Club", image: "Asset 160@3x.webp" },
  { abbr: "SLT", name: "SLT Mobitel", image: "Asset 161@3x.webp" },
  { abbr: "SLA", name: "SriLankan Airlines", image: "Asset 162@3x.webp" },
  { abbr: "NES", name: "Nestlé", image: "Asset 163@3x.webp" },
  { abbr: "DP", name: "DP Education", image: "Asset 164@3x.webp" },
  
  // Extra Files (New Clients)
  { abbr: "P1", name: "Partner Brand 1", image: "Asset 165@3x.webp" },
  { abbr: "P2", name: "Partner Brand 2", image: "Asset 166@3x.webp" },
  { abbr: "P3", name: "Partner Brand 3", image: "Asset 167@3x.webp" },
  { abbr: "P4", name: "Partner Brand 4", image: "Asset 168@3x.webp" },
]

// Split for marquee rows
const clients1 = clients.slice(0, 21)
const clients2 = clients.slice(21, 42)

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
          {[...clients1, ...clients1, ...clients1].map((client, index) => (
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
