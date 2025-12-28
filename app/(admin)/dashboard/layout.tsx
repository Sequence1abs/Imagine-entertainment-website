import { cookies } from 'next/headers'
import { DashboardLayoutClient } from '@/components/dashboard/layout-client'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check for hardcoded session cookie
  const cookieStore = await cookies()
  const session = cookieStore.get('dashboard_session')
  const isAuthenticated = session?.value === 'authenticated'

  // Mock user object for components
  const user = {
    email: 'admin@imaginesl.com',
    name: 'Admin',
  }

  return (
    <DashboardLayoutClient 
      isAuthenticated={isAuthenticated} 
      user={user}
    >
      {children}
    </DashboardLayoutClient>
  )
}
