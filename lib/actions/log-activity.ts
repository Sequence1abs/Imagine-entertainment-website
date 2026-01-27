"use server"

import { createAdminClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { UAParser } from "ua-parser-js"

export async function logActivity(
  action: string, 
  details: any = null, 
  entityType?: string, 
  entityId?: string,
  userId?: string | null
) {
  try {
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

    const payload = {
      action,
      details: typeof details === 'object' && details !== null ? { ...details } : {},
      entity_type: entityType,
      entity_id: entityId,
      user_id: userId ?? null,
      device_info: deviceInfo
    }

    const { error } = await supabase.from("activity_logs").insert(payload)

    if (error) {
      console.error('Error inserting activity log:', error)
    }
  } catch (err) {
    // Silently fail logging to prevent blocking the main operation
    console.error('logActivity failed:', err)
  }
}

