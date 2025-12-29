import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { Event, EventWithImages, EventImage, GalleryImage, EventFormData } from '@/lib/types/database'

// ============ PUBLIC READ OPERATIONS ============

// Get all published events (for public /work page)
export async function getPublishedEvents(): Promise<Event[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('event_date', { ascending: false })
  
  if (error) {
    console.error('Error fetching published events:', error)
    return []
  }
  
  return data || []
}

// Get single event by ID (for public /work/[id] page)
export async function getEventById(id: string): Promise<EventWithImages | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      event_images (*)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    // Only log if it's a real error (not just "not found")
    if (error.message && error.code !== 'PGRST116') {
      console.error('Error fetching event:', error.message)
    }
    return null
  }
  
  return data as EventWithImages
}

// Get all gallery images (for public /gallery page)
// Uses admin client since this is public data and doesn't need user context
export async function getAllGalleryImages(): Promise<string[]> {
  const supabase = createAdminClient()
  
  // Get standalone gallery images
  const { data: galleryImages, error: galleryError } = await supabase
    .from('gallery_images')
    .select('image_url')
    .order('created_at', { ascending: false })
  
  if (galleryError) {
    console.error('Error fetching gallery_images:', galleryError)
  }
  
  // Get event images from published events
  const { data: eventImages, error: eventError } = await supabase
    .from('event_images')
    .select('image_url, events!inner(is_published)')
    .eq('events.is_published', true)
    .order('created_at', { ascending: false })
  
  if (eventError) {
    console.error('Error fetching event_images:', eventError)
  }
  
  const images: string[] = []
  
  if (galleryImages) {
    images.push(...galleryImages.map(img => img.image_url))
  }
  
  if (eventImages) {
    images.push(...eventImages.map(img => img.image_url))
  }
  
  return images
}

// ============ ADMIN OPERATIONS ============

// Get all events (for dashboard)
export async function getAllEvents(): Promise<Event[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching all events:', error)
    return []
  }
  
  return data || []
}

// Create event
export async function createEvent(formData: EventFormData): Promise<{ data: Event | null; error: string | null }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .insert([{
      title: formData.title,
      category: formData.category,
      event_date: formData.event_date || null,
      location: formData.location || null,
      description: formData.description || null,
      cover_image_url: formData.cover_image_url || null,
      is_published: formData.is_published ?? false,
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating event:', error)
    return { data: null, error: error.message }
  }
  
  return { data, error: null }
}

// Update event
export async function updateEvent(id: string, formData: Partial<EventFormData>): Promise<{ data: Event | null; error: string | null }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('events')
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating event:', error)
    return { data: null, error: error.message }
  }
  
  return { data, error: null }
}

// Delete event
export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting event:', error)
    return { error: error.message }
  }
  
  return { error: null }
}

// ============ EVENT IMAGES ============

// Add image to event
export async function addEventImage(eventId: string, imageUrl: string, altText?: string): Promise<{ data: EventImage | null; error: string | null }> {
  const supabase = await createClient()
  
  // Get max display order
  const { data: existing } = await supabase
    .from('event_images')
    .select('display_order')
    .eq('event_id', eventId)
    .order('display_order', { ascending: false })
    .limit(1)
  
  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0
  
  const { data, error } = await supabase
    .from('event_images')
    .insert([{
      event_id: eventId,
      image_url: imageUrl,
      alt_text: altText || null,
      display_order: nextOrder,
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error adding event image:', error)
    return { data: null, error: error.message }
  }
  
  return { data, error: null }
}

// Delete event image
export async function deleteEventImage(imageId: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('event_images')
    .delete()
    .eq('id', imageId)
  
  if (error) {
    console.error('Error deleting event image:', error)
    return { error: error.message }
  }
  
  return { error: null }
}

// ============ GALLERY IMAGES ============

// Add standalone gallery image
export async function addGalleryImage(imageUrl: string, altText?: string): Promise<{ data: GalleryImage | null; error: string | null }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('gallery_images')
    .insert([{
      image_url: imageUrl,
      alt_text: altText || null,
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error adding gallery image:', error)
    return { data: null, error: error.message }
  }
  
  return { data, error: null }
}

// Get all standalone gallery images (for dashboard)
export async function getStandaloneGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }
  
  return data || []
}

// Delete gallery image
export async function deleteGalleryImage(imageId: string): Promise<{ error: string | null }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', imageId)
  
  if (error) {
    console.error('Error deleting gallery image:', error)
    return { error: error.message }
  }
  
  return { error: null }
}
