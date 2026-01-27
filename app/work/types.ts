// Shared types for work page (can be imported by both server and client components)
// Note: We define categories here instead of importing to avoid server/client module conflicts

export interface Project {
  id: string
  title: string
  category: string
  image: string
  event_date?: string
  location?: string
}

// Event categories - must match lib/types/database.ts
export const categories = [
  "All",
  "Corporate",
  "Television & Film",
  "Music",
  "Rigging Services",
  "Public/Sports Events",
  "In-House Studio",
  "Weddings & Private Celebrations",
] as const
