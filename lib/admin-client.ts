export async function adminClientFetch<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `/api/admin${path}`
  
  const headers = new Headers(options?.headers || {})
  
  if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  let data
  try {
    data = await res.json()
  } catch (err) {
    if (!res.ok) {
      throw new Error(`Admin API Error: ${res.statusText}`)
    }
    return null as T
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Admin API Error: ${res.status}`)
  }

  // The admin API usually returns { data: T } or { success: true }
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data as T
  }

  return data as T
}
