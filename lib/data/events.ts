import { createClient, createAdminClient } from '@/lib/supabase/server'
import type { Event, EventWithImages, EventImage, GalleryImage, EventFormData } from '@/lib/types/database'
import { deleteFromCloudflareImages } from '@/lib/actions/cloudflare-delete'

// ============ PUBLIC READ OPERATIONS ============
// All public read operations use admin client since they don't need user context

// Get all published events (for public /work page)
// Optimized to only fetch needed fields for faster queries
export async function getPublishedEvents(): Promise<Event[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('events')
    .select('id, title, category, cover_image_url, event_date, location, description, is_published, created_at, updated_at')
    .eq('is_published', true)
    .order('event_date', { ascending: false })

  if (error) {
    console.error('Error fetching published events:', error)
    return []
  }

  return (data || []) as Event[]
}

// Get single event by ID (for public /work/[id] page)
export async function getEventById(id: string): Promise<EventWithImages | null> {
  const supabase = createAdminClient()

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

  if (!data) {
    return null
  }

  // Deduplicate event_images by image_url to prevent duplicate images in gallery
  const eventData = data as EventWithImages
  if (eventData.event_images && eventData.event_images.length > 0) {
    const seenUrls = new Set<string>()
    const uniqueImages = eventData.event_images.filter((img) => {
      if (seenUrls.has(img.image_url)) {
        return false
      }
      seenUrls.add(img.image_url)
      return true
    })
    eventData.event_images = uniqueImages
  }

  return eventData
}

/**
 * Get all gallery images (for public /gallery page)
 * IMPORTANT: This function ONLY fetches images from the database (Supabase),
 * NOT directly from Cloudflare Images API. Only images uploaded through the
 * dashboard and stored in the database are returned.
 * 
 * Uses admin client since this is public data and doesn't need user context
 * 
 * Deduplicates images by URL to ensure each unique image appears only once
 */
export async function getAllGalleryImages(): Promise<string[]> {
  const supabase = createAdminClient()

  // Get standalone gallery images (uploaded via dashboard with 'gallery_' prefix)
  const { data: galleryImages, error: galleryError } = await supabase
    .from('gallery_images')
    .select('image_url, created_at')
    .order('created_at', { ascending: false })

  if (galleryError) {
    console.error('Error fetching gallery_images:', galleryError)
  }

  // Get event images from published events (uploaded via dashboard with 'event_' prefix)
  const { data: eventImages, error: eventError } = await supabase
    .from('event_images')
    .select('image_url, created_at, events!inner(is_published)')
    .eq('events.is_published', true)
    .order('created_at', { ascending: false })

  if (eventError) {
    console.error('Error fetching event_images:', eventError)
  }

  // Normalize URL to handle variations (trailing slashes, case sensitivity, Cloudflare variants, etc.)
  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      // Remove Cloudflare variant suffixes (/public, /gallery, /thumbnail, /hero) to get base image ID
      // This ensures the same image with different variants is treated as the same image
      let pathname = urlObj.pathname;
      pathname = pathname.replace(/\/(public|gallery|thumbnail|hero)$/, '');
      
      // Reconstruct URL without variant suffix
      const normalizedUrl = `${urlObj.protocol}//${urlObj.host}${pathname}`;
      
      // Remove trailing slash and normalize
      return normalizedUrl.replace(/\/$/, '');
    } catch {
      // If URL parsing fails, try to extract base URL manually
      // Remove Cloudflare variant suffixes
      const withoutVariant = url.replace(/\/(public|gallery|thumbnail|hero)(\/|$)/, '/');
      return withoutVariant.trim().toLowerCase().replace(/\/$/, '');
    }
  };

  // Use Map to track normalized URLs and keep the first occurrence
  const uniqueImageUrls = new Map<string, string>()

  // Add gallery images (deduplicates automatically via normalized URL)
  if (galleryImages && galleryImages.length > 0) {
    galleryImages.forEach(img => {
      if (img.image_url && img.image_url.trim()) {
        const normalized = normalizeUrl(img.image_url);
        if (!uniqueImageUrls.has(normalized)) {
          uniqueImageUrls.set(normalized, img.image_url); // Store original URL
        }
      }
    })
  }

  // Add event images (deduplicates automatically via normalized URL)
  if (eventImages && eventImages.length > 0) {
    eventImages.forEach(img => {
      if (img.image_url && img.image_url.trim()) {
        const normalized = normalizeUrl(img.image_url);
        if (!uniqueImageUrls.has(normalized)) {
          uniqueImageUrls.set(normalized, img.image_url); // Store original URL
        }
      }
    })
  }

  // Convert Map values back to array (preserves original URLs)
  return Array.from(uniqueImageUrls.values())
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

// Delete event (with all associated images from Cloudflare Images)
export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // First, fetch the event to get cover image URL
  const { data: event } = await supabase
    .from('events')
    .select('cover_image_url')
    .eq('id', id)
    .single()

  // Fetch all associated event images
  const { data: eventImages } = await supabase
    .from('event_images')
    .select('image_url')
    .eq('event_id', id)

  // Delete cover image from Cloudflare Images
  if (event?.cover_image_url) {
    if (event.cover_image_url.includes('images.imaginesl.com') || event.cover_image_url.includes('imagedelivery.net')) {
      const coverResult = await deleteFromCloudflareImages(event.cover_image_url)
      if (!coverResult.success) {
        console.warn('Failed to delete cover image from Cloudflare Images:', coverResult.error)
      }
    } else {
      console.log('Cover image URL is not Cloudflare Images, skipping deletion:', event.cover_image_url)
    }
  }

  // Delete all event images from Cloudflare Images
  if (eventImages && eventImages.length > 0) {
    for (const img of eventImages) {
      if (img.image_url) {
        if (img.image_url.includes('images.imaginesl.com') || img.image_url.includes('imagedelivery.net')) {
          const result = await deleteFromCloudflareImages(img.image_url)
          if (!result.success) {
            console.warn('Failed to delete event image from Cloudflare Images:', result.error)
          }
        } else {
          console.log('Event image URL is not Cloudflare Images, skipping deletion:', img.image_url)
        }
      }
    }
  }

  // Delete event from database (cascade will delete event_images records)
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

// Delete event image (from Cloudflare Images and database)
export async function deleteEventImage(imageId: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // First, get the image URL so we can delete from Cloudflare Images
  const { data: imageData, error: fetchError } = await supabase
    .from('event_images')
    .select('image_url')
    .eq('id', imageId)
    .single()

  if (fetchError) {
    console.error('Error fetching event image for deletion:', fetchError)
    return { error: fetchError.message }
  }

  // Delete from Cloudflare Images (don't fail if this fails, continue with DB deletion)
  if (imageData?.image_url) {
    if (imageData.image_url.includes('images.imaginesl.com') || imageData.image_url.includes('imagedelivery.net')) {
      const cloudflareResult = await deleteFromCloudflareImages(imageData.image_url)
      if (!cloudflareResult.success) {
        console.warn('Failed to delete from Cloudflare Images, continuing with DB deletion:', cloudflareResult.error)
      }
    } else {
      // R2 or other URLs - log but don't fail
      console.log('Image URL is not Cloudflare Images, skipping deletion:', imageData.image_url)
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('event_images')
    .delete()
    .eq('id', imageId)

  if (error) {
    console.error('Error deleting event image from database:', error)
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

// Delete gallery image (from Cloudflare Images and database)
export async function deleteGalleryImage(imageId: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // First, get the image URL so we can delete from Cloudflare Images
  const { data: imageData, error: fetchError } = await supabase
    .from('gallery_images')
    .select('image_url')
    .eq('id', imageId)
    .single()

  if (fetchError) {
    console.error('Error fetching gallery image for deletion:', fetchError)
    return { error: fetchError.message }
  }

  // Delete from Cloudflare Images (don't fail if this fails, continue with DB deletion)
  if (imageData?.image_url) {
    if (imageData.image_url.includes('images.imaginesl.com') || imageData.image_url.includes('imagedelivery.net')) {
      const cloudflareResult = await deleteFromCloudflareImages(imageData.image_url)
      if (!cloudflareResult.success) {
        console.warn('Failed to delete from Cloudflare Images, continuing with DB deletion:', cloudflareResult.error)
      }
    } else {
      // R2 or other URLs - log but don't fail
      console.log('Image URL is not Cloudflare Images, skipping deletion:', imageData.image_url)
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', imageId)

  if (error) {
    console.error('Error deleting gallery image from database:', error)
    return { error: error.message }
  }

  return { error: null }
}
