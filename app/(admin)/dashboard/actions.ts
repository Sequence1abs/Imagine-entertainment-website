'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { logActivity } from '@/lib/actions/log-activity'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Log failed login attempt
    await logActivity("Failed Login Attempt", { email, error: error.message }, "auth")
    return { error: error.message }
  }

  // Log successful login
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await logActivity("User Login", { email: user.email }, "auth", user.id, user.id)
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  
  // Log signout before clearing session
  try {
     const { data: { user } } = await supabase.auth.getUser()
     if (user) {
        await logActivity("User Logout", { email: user.email }, "auth", user.id, user.id)
     }
  } catch (e) {
    console.error("Failed to log logout:", e)
  }

  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string
  
  // Create admin client to check if user exists
  const supabaseAdmin = createAdminClient()
  
  // Check if user exists primarily to give better error feedback as requested
  // Note: Only do this in admin/internal apps where email enumeration is acceptable
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
  
  if (listError) {
    return { error: 'Failed to verify user. Please try again.' }
  }

  const userExists = users.some(u => u.email?.toLowerCase() === email.toLowerCase())

  if (!userExists) {
    return { error: 'No account found with this email address.' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) {
    return { error: 'Server configuration error. Please contact support.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

