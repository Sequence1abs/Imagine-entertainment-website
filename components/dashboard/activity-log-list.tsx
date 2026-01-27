"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { ActivityLog } from "@/lib/types/database"
import { formatDistanceToNow } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Activity } from "lucide-react"

export function ActivityLogList() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchLogs()

    // Subscribe to new logs
    const channel = supabase
      .channel('activity_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_logs' },
        (payload) => {
          const newLog = payload.new as ActivityLog
          // Ideally fetch user details here, but for now just show email if we have it or fallback
          setLogs((prev) => [newLog, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchLogs, supabase])



  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No recent activity</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="hidden md:table-cell">Device</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.action}</TableCell>
              <TableCell className="whitespace-normal">
                <div className="flex flex-col gap-1 max-w-[200px] sm:max-w-[300px]">
                  {log.details && Object.entries(log.details)
                    .filter(([key]) => key !== 'user_email')
                    .map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="text-muted-foreground font-semibold uppercase text-[10px] mr-1">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="break-all text-foreground/90">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  {!log.details && <span className="text-xs text-muted-foreground italic">No details</span>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary uppercase">
                      {log.details?.user_email?.[0] || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {log.details?.user_email || 'Admin'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                {log.device_info ? (
                  <div className="flex flex-col">
                    <span>{log.device_info.browser}</span>
                    <span className="text-[10px] opacity-70">{log.device_info.os}</span>
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
