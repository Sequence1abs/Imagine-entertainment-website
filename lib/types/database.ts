// Database types for Supabase

// Event categories
export const EVENT_CATEGORIES = [
  'Corporate',
  'Television & Film',
  'Music',
  'Rigging Services',
  'Public/Sports Events',
  'In-House Studio',
  'Weddings & Private',
] as const

export type EventCategory = typeof EVENT_CATEGORIES[number]

// Event type
export interface Event {
  id: string
  title: string
  category: EventCategory
  event_date: string | null
  location: string | null
  description: string | null // Internal only, NOT shown publicly
  cover_image_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

// Event image type
export interface EventImage {
  id: string
  event_id: string
  image_url: string
  alt_text: string | null
  display_order: number
  created_at: string
}

// Gallery image type (standalone images not tied to events)
export interface GalleryImage {
  id: string
  image_url: string
  alt_text: string | null
  created_at: string
}

// Activity Log type
export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  details: any | null
  created_at: string
  device_info: {
    browser?: string
    os?: string
    device?: string
    ip?: string
  } | null
  // Joined user data
  user?: {
    email: string
  }
}

// Event with images
export interface EventWithImages extends Event {
  event_images: EventImage[]
}

// Form data for creating/updating events
export interface EventFormData {
  title: string
  category: EventCategory
  event_date?: string
  location?: string
  description?: string
  cover_image_url?: string
  is_published?: boolean
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
}
