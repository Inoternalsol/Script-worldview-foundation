export async function adminClientFetch<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `/api/admin${path}`
  
  const headers = new Headers(options?.headers || {})
  
  if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    })

    let data
    try {
      data = await res.json()
    } catch {
      if (!res.ok) {
        console.warn(`[Admin Client Fetch Warning] Endpoint ${url} returned status ${res.status}: ${res.statusText}`)
        return {} as T
      }
      return null as T
    }

    if (!res.ok) {
      console.warn(`[Admin Client Fetch Warning] Endpoint ${url} returned ${res.status}:`, data?.error || data?.message)
      // Return empty object/data fallback so Promise.all and UI don't crash when Cloudflare worker is missing route
      return (data || {}) as T
    }

    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T
    }

    return data as T
  } catch (error) {
    console.warn(`[Admin Client Fetch Network Error] Could not reach ${url}:`, error)
    return {} as T
  }
}
