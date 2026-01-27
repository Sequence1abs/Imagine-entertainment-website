"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { getCloudflareImageUrl } from "@/lib/config"

// Services data
const services = [
  {
    id: 1,
    title: "Corporate Events",
    eventType: "Corporate",
    filterCategory: "Corporate",
    image: getCloudflareImageUrl("784ec4d5-b17a-44e2-8ac3-972109413c00"),
    span: "md:col-span-1",
  },
  {
    id: 2,
    title: "Television & Film Production",
    eventType: "Television & Film",
    filterCategory: "Television & Film",
    image: getCloudflareImageUrl("1b106750-e725-4a0c-d2b8-060dbad77f00"),
    span: "md:col-span-1",
  },
  {
    id: 3,
    title: "Musical Concert",
    eventType: "Musical Concert",
    filterCategory: "Music",
    image: getCloudflareImageUrl("8c4d5f4d-010e-497c-7195-4459bacc4e00"),
    span: "md:col-span-2",
  },
  {
    id: 4,
    title: "Rigging Services",
    eventType: "Rigging",
    filterCategory: "Rigging Services",
    image: getCloudflareImageUrl("8fc88259-8e13-411d-b9f1-bb4d3decf700"),
    span: "md:col-span-1",
  },
  {
    id: 5,
    title: "In-House Studio",
    eventType: "In-House Studio",
    filterCategory: "In-House Studio",
    image: getCloudflareImageUrl("8c11d2f0-c4ec-4dec-a0c3-a8be93f6fa00"),
    span: "md:col-span-1",
  },
  {
    id: 6,
    title: "Public, Sports & Major Events",
    eventType: "Public/Sports Events",
    filterCategory: "Public/Sports Events",
    image: getCloudflareImageUrl("dbe466bb-2212-495c-123b-50739c819700"),
    span: "md:col-span-2",
  },
  {
    id: 7,
    title: "Weddings & Private Celebrations",
    eventType: "Weddings & Private Celebrations",
    filterCategory: "Weddings & Private Celebrations",
    image: getCloudflareImageUrl("f0616e1b-ee30-472c-279e-b618e6149000"),
    span: "md:col-span-1",
  },
]

export function ServicesGrid() {
  return (
    <section className="pt-10 md:pt-14 pb-20 md:pb-28 mx-4 md:mx-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5 auto-rows-[220px] md:auto-rows-[280px]">
          {services.map((service, index) => (
            <ServiceBentoCard key={service.id} service={service} index={index} />
          ))}
          <ViewServicesCard index={services.length} />
        </div>
      </div>
    </section>
  )
}

function ServiceBentoCard({ service, index }: { service: (typeof services)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)

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
    <Link
      href={`/work?category=${encodeURIComponent(service.filterCategory || service.eventType)}`}
      ref={ref}
      className={`cursor-target group relative block h-full overflow-hidden rounded-xl transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        } ${service.span} w-full`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="absolute inset-0">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-500" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-medium text-white dark:text-white leading-tight">
            {service.title}
          </h3>
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl transition-all duration-500 pointer-events-none" />
    </Link>
  )
}

function ViewServicesCard({ index }: { index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)

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
    <Link
      href="/services"
      ref={ref}
      className={`cursor-target group relative block h-full overflow-hidden rounded-xl transition-all duration-700 md:col-span-1 w-full ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="absolute inset-0 bg-muted dark:bg-muted/50 group-hover:bg-muted/80 dark:group-hover:bg-muted/70 transition-all duration-500" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground mb-4 leading-tight">
            View Our Services
          </h3>
          <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 mx-auto text-muted-foreground dark:text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-border dark:group-hover:border-border rounded-xl transition-all duration-500 pointer-events-none" />
    </Link>
  )
}
