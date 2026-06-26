export async function apiFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
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
      throw new Error(`API Error: ${res.statusText}`)
    }
    return null as T
  }

  if (!res.ok) {
    throw new Error(data?.error || data?.message || `API Error: ${res.status}`)
  }

  return data
}
