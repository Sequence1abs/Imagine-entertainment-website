import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const imagesDir = join(process.cwd(), 'public', 'images')
    const files = await readdir(imagesDir)
    
    // Filter for image files only (jpg, jpeg, png, webp, gif)
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const imageFiles = files
      .filter(file => {
        const ext = file.toLowerCase().substring(file.lastIndexOf('.'))
        return imageExtensions.includes(ext)
      })
      .map(file => `/images/${file}`)
      .sort() // Sort alphabetically for consistent ordering
    
    return NextResponse.json({ images: imageFiles })
  } catch (error) {
    console.error('Error reading images directory:', error)
    return NextResponse.json(
      { error: 'Failed to read images directory', images: [] },
      { status: 500 }
    )
  }
}

