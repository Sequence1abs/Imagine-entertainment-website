import { createClient } from '@/lib/supabase/server'
import { DashboardLayoutClient } from '@/components/dashboard/layout-client'
import { UploadQueueProvider } from '@/context/upload-queue'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // User object for components
  const userData = user ? {
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
  } : undefined

  return (
    <UploadQueueProvider>
      <DashboardLayoutClient 
        isAuthenticated={isAuthenticated} 
        user={userData}
      >
        {children}
      </DashboardLayoutClient>
    </UploadQueueProvider>
  )
}
