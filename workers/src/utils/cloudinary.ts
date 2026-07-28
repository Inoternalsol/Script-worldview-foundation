import { Env } from '../types'

/**
 * Uploads a File or Blob to Cloudinary via Signed Uploads.
 * Securely generates the SHA-1 signature using WebCrypto.
 */
export async function uploadToCloudinary(
  file: File | Blob,
  env: Env,
  options?: { folder?: string; resourceType?: 'image' | 'video' | 'raw' | 'auto' }
) {
  const timestamp = Math.round(new Date().getTime() / 1000).toString()
  const resourceType = options?.resourceType || 'auto'
  
  // Cloudinary Signature Generation rules:
  // 1. Sort all params to sign alphabetically by key.
  // 2. Format as key=value&key=value...
  // 3. Append the api_secret.
  // 4. Hash with SHA-1.
  const params: Record<string, string> = {
    timestamp
  }
  
  if (options?.folder) {
    params.folder = options.folder
  }

  const sortedKeys = Object.keys(params).sort()
  const signatureString = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + env.CLOUDINARY_API_SECRET

  // Generate SHA-1 hash using Web Crypto API (native in Cloudflare Workers)
  const encoder = new TextEncoder()
  const data = encoder.encode(signatureString)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', env.CLOUDINARY_API_KEY)
  formData.append('timestamp', timestamp)
  formData.append('signature', signature)
  
  if (options?.folder) {
    formData.append('folder', options.folder)
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Cloudinary Upload Error:', errorBody)
    throw new Error(`Failed to upload to Cloudinary: ${response.statusText}`)
  }

  const result = await response.json()
  return result as {
    secure_url: string
    public_id: string
    bytes: number
    format: string
    resource_type: string
  }
}
