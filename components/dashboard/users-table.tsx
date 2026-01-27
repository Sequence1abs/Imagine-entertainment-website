"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Trash2, 
  Loader2, 
  UserPlus, 
  Mail, 
  KeyRound,
  Crown,
  MoreHorizontal,
  CheckCircle2,
  Clock
} from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Slider Toggle Component with CSS animation
function SliderToggle({ 
  addMode, 
  setAddMode 
}: { 
  addMode: "direct" | "invite"
  setAddMode: (mode: "direct" | "invite") => void 
}) {
  return (
    <div className="relative bg-muted rounded-xl p-1">
      {/* Sliding indicator */}
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background border border-border rounded-lg shadow-sm transition-all duration-300 ease-out ${
          addMode === 'invite' ? 'left-[calc(50%)]' : 'left-1'
        }`}
      />
      
      {/* Buttons */}
      <div className="relative grid grid-cols-2">
        <button
          type="button"
          onClick={() => setAddMode("direct")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors z-10 ${
            addMode === "direct" 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <KeyRound className="size-4" />
          Direct Add
        </button>
        <button
          type="button"
          onClick={() => setAddMode("invite")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors z-10 ${
            addMode === "invite" 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="size-4" />
          Send Invite
        </button>
      </div>
    </div>
  )
}

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  is_current: boolean
}

export function UsersTable() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Add user dialog
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addMode, setAddMode] = useState<"direct" | "invite">("direct")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState<string | null>(null)
  
  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      console.log('Fetched users:', data.users)
      console.log('Current user ID:', data.currentUserId)
      setUsers(data.users)
      setCurrentUserId(data.currentUserId)
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAddUser = async () => {
    setAddError(null)
    setAddSuccess(null)
    setIsAdding(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: addMode === "direct" ? newPassword : undefined,
          sendInvite: addMode === "invite"
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setAddError(data.error || 'Failed to add user')
        setIsAdding(false)
        return
      }

      setAddSuccess(addMode === "invite" 
        ? 'Invitation sent successfully!' 
        : 'User created successfully!'
      )
      
      // Reset form after short delay
      setTimeout(() => {
        setShowAddDialog(false)
        setNewEmail("")
        setNewPassword("")
        setAddSuccess(null)
        fetchUsers() // Refresh list
      }, 1500)
      
    } catch (err) {
      setAddError('An unexpected error occurred')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    
    setIsDeleting(true)
    const userIdToDelete = userToDelete.id
    
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userIdToDelete })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user')
      }

      // Success - close dialog immediately and reset state
      setShowDeleteDialog(false)
      setUserToDelete(null)
      setIsDeleting(false)
      
      // Refresh the users list after a brief delay to ensure dialog is closed
      setTimeout(() => {
        fetchUsers()
      }, 100)
      
    } catch (err) {
      // Close dialog even on error to prevent UI from getting stuck
      setShowDeleteDialog(false)
      setUserToDelete(null)
      setIsDeleting(false)
      // Show error after dialog is closed
      setTimeout(() => {
        alert(err instanceof Error ? err.message : 'Failed to delete user')
      }, 150)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="text-sm text-muted-foreground">
              {users.length} {users.length === 1 ? 'user' : 'users'} registered
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <UserPlus className="size-4" />
            Add User
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 py-4 bg-red-500/10 border-b border-red-500/20">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto relative">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  User
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Created
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Last Sign In
                </th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className={`transition-colors ${
                    user.is_current 
                      ? 'bg-primary/5 hover:bg-primary/10' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{user.email}</p>
                          {user.is_current && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              <Crown className="size-3" />
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-mono truncate">
                          {user.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.email_confirmed_at ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-green-500">
                        <CheckCircle2 className="size-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-yellow-500">
                        <Clock className="size-3.5" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(user.last_sign_in_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!user.is_current ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon-sm" 
                            className="h-8 w-8"
                            aria-label={`Actions for ${user.email}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          sideOffset={5}
                          className="z-[100] min-w-[150px] bg-popover"
                        >
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => {
                              console.log('Delete selected for user:', user.email, 'User ID:', user.id, 'Is current:', user.is_current)
                              setUserToDelete(user)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="size-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-xs text-muted-foreground">Current user</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account or send an invitation
            </DialogDescription>
          </DialogHeader>

          {/* Sliding Toggle */}
          <SliderToggle addMode={addMode} setAddMode={setAddMode} />

          {/* Direct Add Form */}
          {addMode === "direct" && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  placeholder="user@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={isAdding}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-password">Password</Label>
                <Input
                  id="add-password"
                  type="password"
                  placeholder="Set a password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isAdding}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters
                </p>
              </div>
            </div>
          )}

          {/* Invite Form */}
          {addMode === "invite" && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="user@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={isAdding}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                An invitation email will be sent. The user will set their own password.
              </p>
            </div>
          )}

          {addError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500">{addError}</p>
            </div>
          )}

          {addSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-500">{addSuccess}</p>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              disabled={isAdding || !newEmail || (addMode === "direct" && !newPassword)}
            >
              {isAdding ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {addMode === "invite" ? "Sending..." : "Creating..."}
                </>
              ) : (
                addMode === "invite" ? "Send Invitation" : "Create User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            // Only allow closing if not currently deleting
            setShowDeleteDialog(false)
            setUserToDelete(null)
          }
        }}
        title="Delete User"
        description={`Are you sure you want to delete ${userToDelete?.email}? This action cannot be undone.`}
        onConfirm={handleDeleteUser}
        loading={isDeleting}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  )
}
