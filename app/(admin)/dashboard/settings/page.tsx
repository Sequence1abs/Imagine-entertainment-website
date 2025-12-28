import { createClient } from '@/lib/supabase/server'
import { Settings } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Account Information</h2>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Account ID</p>
            <p className="font-mono text-sm">{user?.id}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Last Sign In</p>
            <p className="text-sm">
              {user?.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleString()
                : 'N/A'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder for future settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-4 text-muted-foreground">
          <Settings className="size-8" />
          <div>
            <p className="font-medium text-foreground">More settings coming soon</p>
            <p className="text-sm">Password change, notifications, and more</p>
          </div>
        </div>
      </div>
    </div>
  )
}
