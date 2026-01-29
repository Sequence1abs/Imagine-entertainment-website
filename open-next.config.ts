import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache'
import d1NextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache'

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  // Required for on-demand revalidation: revalidatePath('/work'), revalidatePath('/gallery'), etc.
  // Without this, dashboard updates (new events, gallery changes) do not show on the deployed site.
  tagCache: d1NextTagCache,
  // Required for ISR: when /work or /gallery are stale (revalidate = 60), Next.js sends revalidation
  // to a queue. Default is "dummy" which throws "Dummy queue is not implemented". "direct" runs
  // revalidation in-process so stale pages can revalidate without a separate queue/DO.
  queue: 'direct',
})
