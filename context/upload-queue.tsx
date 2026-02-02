'use client'

import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import { toast } from 'sonner'

export type UploadQueueJob = {
  id: string
  eventId: string
  eventTitle?: string
  cloudFolder: string
  coverFile?: File
  coverUrl?: string
  galleryFiles: File[]
  status: 'pending' | 'uploading_cover' | 'uploading_gallery' | 'done' | 'error'
  error?: string
}

type UploadQueueContextValue = {
  jobs: UploadQueueJob[]
  addJob: (job: Omit<UploadQueueJob, 'id' | 'status'>) => void
  removeJob: (id: string) => void
}

const UploadQueueContext = createContext<UploadQueueContextValue | null>(null)

export function UploadQueueProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<UploadQueueJob[]>([])
  const processingRef = useRef(false)

  const addJob = useCallback((job: Omit<UploadQueueJob, 'id' | 'status'>) => {
    const id = `job-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const newJob: UploadQueueJob = { ...job, id, status: 'pending' }
    setJobs((prev) => [...prev, newJob])
  }, [])

  const removeJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }, [])

  const updateJob = useCallback((id: string, updates: Partial<UploadQueueJob>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)))
  }, [])

  const processQueue = useCallback(async () => {
    if (processingRef.current) return
    const next = jobs.find((j) => j.status === 'pending')
    if (!next) return
    if (!next.coverFile && next.galleryFiles.length === 0) {
      updateJob(next.id, { status: 'done' })
      setJobs((prev) => prev.filter((j) => j.id !== next.id))
      return
    }

    const job = next
    processingRef.current = true
    updateJob(job.id, { status: job.coverFile ? 'uploading_cover' : 'uploading_gallery' })

      try {
        let coverUrl = job.coverUrl

        if (job.coverFile && !coverUrl) {
          const formData = new FormData()
          formData.append('file', job.coverFile)
          formData.append('prefix', 'event_')
          formData.append('folder', job.cloudFolder)
          const res = await fetch('/api/upload', { method: 'POST', body: formData })
          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || 'Cover upload failed')
          }
          const data = await res.json()
          coverUrl = data?.url ?? null
          if (coverUrl) {
            await fetch(`/api/events/${job.eventId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cover_image_url: coverUrl }),
            })
          }
        }

        if (job.galleryFiles.length > 0) {
          updateJob(job.id, { status: 'uploading_gallery' })
          const CONCURRENCY = 5
          const uploadedUrls: string[] = []
          const uploadOne = async (file: File): Promise<string | null> => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('prefix', 'event_')
            formData.append('folder', job.cloudFolder)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (!res.ok) return null
            const data = await res.json()
            return data?.url ?? null
          }
          for (let i = 0; i < job.galleryFiles.length; i += CONCURRENCY) {
            const batch = job.galleryFiles.slice(i, i + CONCURRENCY)
            const results = await Promise.all(batch.map(uploadOne))
            uploadedUrls.push(...results.filter((u): u is string => u != null))
          }
          if (uploadedUrls.length > 0) {
            await fetch('/api/admin/events/images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ event_id: job.eventId, image_urls: uploadedUrls }),
            })
          }
        }

        updateJob(job.id, { status: 'done' })
        toast.success(job.eventTitle ? `"${job.eventTitle}" finished uploading` : 'Event images finished uploading')
        setJobs((prev) => prev.filter((j) => j.id !== job.id))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        updateJob(job.id, { status: 'error', error: message })
        toast.error(message)
      } finally {
        processingRef.current = false
      }
  }, [jobs, updateJob])

  React.useEffect(() => {
    processQueue()
  }, [processQueue, jobs])

  const value: UploadQueueContextValue = { jobs, addJob, removeJob }
  return (
    <UploadQueueContext.Provider value={value}>
      {children}
    </UploadQueueContext.Provider>
  )
}

export function useUploadQueue() {
  const ctx = useContext(UploadQueueContext)
  if (!ctx) return null
  return ctx
}
