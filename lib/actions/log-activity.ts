"use server"

import { createAdminClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { UAParser } from "ua-parser-js"

export async function logActivity(
  action: string, 
  details: any = null, 
  entityType?: string, 
  entityId?: string
) {
  const supabase = createAdminClient()
  const headerList = await headers()
  const userAgent = headerList.get("user-agent") || ""
  const parser = new UAParser(userAgent)
  const result = parser.getResult()
  
  const deviceInfo = {
    browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    device: result.device.type || 'Desktop',
    ip: headerList.get("x-forwarded-for") || "Unknown"
  }

  // Get current user if possible, or leave null (system action)
  const { data: { user } } = await (await createAdminClient()).auth.getUser()

  const payload = {
    action,
    details: {
        ...details,
        user_email: user?.email // Captured for display purposes
    },
    entity_type: entityType,
    entity_id: entityId,
    user_id: user?.id || null,
    device_info: deviceInfo
  }

  const { error } = await supabase.from("activity_logs").insert(payload)

  if (error) {
    console.error('Error inserting activity log:', error)
  }
}
