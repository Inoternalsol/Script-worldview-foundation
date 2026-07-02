export type ApiError = {
  error: string
}

export function getApiBaseUrl() {
  let url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787'
  url = url.replace(/\/api\/?$/, '').replace(/\/$/, '')
  const isProdServer = typeof window === 'undefined' && process.env.NODE_ENV === 'production'
  const isProdClient = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  if (isProdServer || isProdClient) {
    if (!url || url.includes('localhost') || url.includes('swf.vercel.app')) {
      url = 'https://script-worldview-api.scriptworldview-dev.workers.dev'
    }
  }
  return url
}

export interface QueuedRequest {
  id: string
  path: string
  method: string
  body: string
  headers: Record<string, string>
  timestamp: number
  formName: string
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T; queued?: boolean } | { ok: false; error: string; status: number }> {
  const baseUrl = getApiBaseUrl()
  const method = init?.method ?? 'GET'
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())

  try {
    // If we are explicitly offline, throw a network error immediately to trigger queueing
    if (typeof window !== 'undefined' && !navigator.onLine && isMutation) {
      throw new Error('Failed to fetch (Offline Mode)')
    }

    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, error: text || res.statusText, status: res.status }
    }

    const data = (await res.json()) as T
    return { ok: true, data }
  } catch (err: any) {
    // If it's a mutation and we are in the browser, save to offline queue
    if (isMutation && typeof window !== 'undefined') {
      let formName = 'Submission'
      if (init?.body) {
        try {
          const parsed = JSON.parse(init.body as string)
          if (parsed.type) {
            formName = parsed.type.charAt(0).toUpperCase() + parsed.type.slice(1)
          } else if (parsed.department) {
            formName = parsed.department.charAt(0).toUpperCase() + parsed.department.slice(1)
          } else if (parsed.subject) {
            formName = parsed.subject
          }
        } catch {}
      }

      // Read current queue
      const queueJson = localStorage.getItem('sfg_offline_submissions')
      const queue: QueuedRequest[] = queueJson ? JSON.parse(queueJson) : []

      // Create new queued request
      const queuedReq: QueuedRequest = {
        id: Math.random().toString(36).substring(2, 9),
        path,
        method,
        body: init?.body ? (init.body as string) : '',
        headers: (init?.headers ?? {}) as Record<string, string>,
        timestamp: Date.now(),
        formName,
      }

      // Add to queue
      queue.push(queuedReq)
      localStorage.setItem('sfg_offline_submissions', JSON.stringify(queue))

      // Trigger custom window event to notify UI
      window.dispatchEvent(new CustomEvent('sfg-offline-queued', { detail: queuedReq }))

      return {
        ok: true,
        queued: true,
        data: { success: true, queued: true } as any
      }
    }

    // Otherwise, return standard connection error
    return { ok: false, error: err.message || 'Network connection failed', status: 0 }
  }
}


