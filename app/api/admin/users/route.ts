import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logActivity } from '@/lib/actions/log-activity'

export const dynamic = 'force-dynamic'

// GET /api/admin/users - List all users
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabaseAdmin = createAdminClient()
    
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) {
      console.error('Error listing users:', error)
      return NextResponse.json(
        { error: 'Failed to list users' },
        { status: 500 }
      )
    }

    // Return users with safe data only
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
      is_current: user.id === currentUser.id
    }))

    return NextResponse.json({ users: safeUsers, currentUserId: currentUser.id })
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/users - Create a new user
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, password, sendInvite } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createAdminClient()

    if (sendInvite) {
      // Send invitation email
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=${encodeURIComponent('/setup-account?type=invite')}`,
      })

      if (error) {
        console.error('Error inviting user:', error)
        return NextResponse.json(
          { error: error.message || 'Failed to send invitation' },
          { status: 400 }
        )
      }

      // Log invitation
      await logActivity(
        "Sent User Invitation", 
        { email: data.user.email }, 
        "user", 
        data.user.id
      )

      return NextResponse.json({ 
        success: true, 
        message: 'Invitation sent successfully',
        user: {
          id: data.user.id,
          email: data.user.email
        }
      })
    } else {
      // Create user directly with password
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required for direct user creation' },
          { status: 400 }
        )
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for admin-created users
      })

      if (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
          { error: error.message || 'Failed to create user' },
          { status: 400 }
        )
      }

      // Log user creation
      await logActivity(
        "Created User", 
        { email: data.user.email }, 
        "user", 
        data.user.id
      )

      return NextResponse.json({ 
        success: true, 
        message: 'User created successfully',
        user: {
          id: data.user.id,
          email: data.user.email
        }
      })
    }
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users - Delete a user
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Prevent deleting yourself
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account from here' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createAdminClient()

    // Get user email before deleting for log
    const { data: { user: userToDelete } } = await supabaseAdmin.auth.admin.getUserById(userId)

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete user' },
        { status: 400 }
      )
    }

    // Log deletion (non-blocking)
    logActivity(
      "Deleted User", 
      { email: userToDelete?.email }, 
      "user", 
      userId
    ).catch(console.error)

    return NextResponse.json({ 
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error in users API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
