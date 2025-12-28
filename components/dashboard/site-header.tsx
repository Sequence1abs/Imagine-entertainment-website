"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Globe, ExternalLink } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const items = [
      {
        href: "/dashboard",
        label: "Dashboard",
        active: segments.length === 1 && segments[0] === "dashboard"
      }
    ]

    let currentPath = "/dashboard"
    
    segments.forEach((segment, index) => {
      if (segment === "dashboard") return

      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)

      items.push({
        href: currentPath,
        label,
        active: isLast
      })
    })

    return items
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="flex shrink-0 items-center gap-2 border-b px-4 py-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem className={item.active ? "" : "hidden md:block"}>
                {item.active ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex-1" />
      <Button variant="outline" asChild size="sm">
        <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">View Website</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </Button>
    </header>
  )
}
