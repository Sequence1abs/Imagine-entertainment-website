import { Suspense } from "react"
import { getPublishedEvents } from "@/lib/data/events"
import WorkPageClient from "./work-page-client"
import { Project } from "./types"

// Helper to sort projects by year
function sortProjects(projects: Project[]): Project[] {
  return projects.sort((a: Project, b: Project) => {
    // Helper to get year from date or title
    const getYear = (p: Project) => {
      if (p.event_date) return new Date(p.event_date).getFullYear()
      const match = p.title.match(/\b(20\d{2})\b/)
      return match ? parseInt(match[0]) : 0
    }

    const yearA = getYear(a)
    const yearB = getYear(b)

    // Sort by year descending
    if (yearA !== yearB) return yearB - yearA

    // If years are equal, try to keep consistent order (fallback to title)
    return a.title.localeCompare(b.title)
  })
}

// Server component - fetches data on server for faster initial load
// Next.js will cache this page for faster subsequent loads
export const revalidate = 3600 // Revalidate every hour

export default async function WorkPage() {
  // Fetch events on the server (faster than client-side fetch)
  let projects: Project[] = []
  
  try {
    const events = await getPublishedEvents()
    
    if (events && events.length > 0) {
      projects = sortProjects(events.map((event) => ({
        id: event.id,
        title: event.title,
        category: event.category,
        image: event.cover_image_url || '/placeholder.svg',
        event_date: event.event_date || undefined,
        location: event.location || undefined,
      })))
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    // Silently fall back to empty state
  }

  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    }>
      <WorkPageClient initialProjects={projects} />
    </Suspense>
  )
}
