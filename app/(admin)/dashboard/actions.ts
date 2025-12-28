'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Hardcoded test credentials
const TEST_EMAIL = 'admin@imaginesl.com'
const TEST_PASSWORD = 'imagine2024'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Simple hardcoded auth check
  if (email === TEST_EMAIL && password === TEST_PASSWORD) {
    // Set a session cookie
    const cookieStore = await cookies()
    cookieStore.set('dashboard_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    
    redirect('/dashboard')
  }

  return { error: 'Invalid email or password' }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('dashboard_session')
  redirect('/dashboard')
}
