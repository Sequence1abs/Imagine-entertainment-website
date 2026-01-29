/**
 * Fetch with retry and exponential backoff for reliability.
 * Reduces transient network failures (e.g. health checks, status endpoints).
 * Use for non-mutation GET requests where retrying is safe.
 */
export interface FetchWithRetryOptions extends RequestInit {
  /** Number of retries after initial failure (default: 2) */
  retries?: number
  /** Initial delay in ms before first retry (default: 300); doubles each retry */
  baseDelayMs?: number
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const { retries = 2, baseDelayMs = 300, ...init } = options
  let lastError: unknown
  let lastResponse: Response | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(input, init)
      lastResponse = res
      // Retry on 5xx or network failure (fetch throws)
      if (res.ok || res.status < 500) return res
      lastError = new Error(`HTTP ${res.status}`)
    } catch (e) {
      lastError = e
    }
    if (attempt < retries) {
      const delay = baseDelayMs * Math.pow(2, attempt)
      await new Promise((r) => setTimeout(r, delay))
    }
  }

  return lastResponse ?? Promise.reject(lastError)
}
