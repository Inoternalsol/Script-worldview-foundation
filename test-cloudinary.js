import { SignJWT } from 'jose'
import fs from 'fs'

const API_URL = 'http://localhost:8787'
const JWT_SECRET = 'development_jwt_secret_key_12345'
const CLOUD_NAME = 'enj2t03z' // from env

async function generateToken() {
  const secret = new TextEncoder().encode(JWT_SECRET)
    const token = await new SignJWT({ 
      sub: 'test_user_id',
      email: 'test@example.com',
      role: 'super_admin'
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret)
  
  return token
}

async function testCloudinary() {
  try {
    console.log('Generating JWT Token...')
    const token = await generateToken()
    
    console.log('Fetching signature from /api/media/signature...')
    const sigRes = await fetch(`${API_URL}/api/media/signature`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!sigRes.ok) {
      const errText = await sigRes.text()
      throw new Error(`Signature API failed: ${sigRes.status} ${errText}`)
    }
    
    const sigData = await sigRes.json()
    console.log('Signature response:', sigData)
    
    if (!sigData.signature || !sigData.timestamp) {
      throw new Error('Missing signature or timestamp in response')
    }
    
    // Create a dummy text file to upload
    console.log('Uploading dummy file to Cloudinary...')
    const formData = new FormData()
    
    const fileBlob = new Blob(['Hello Cloudinary'], { type: 'text/plain' })
    formData.append('file', fileBlob, 'test-file.txt')
    formData.append('api_key', sigData.apiKey)
    formData.append('timestamp', sigData.timestamp)
    formData.append('signature', sigData.signature)
    
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!uploadRes.ok) {
      const errText = await uploadRes.text()
      throw new Error(`Cloudinary upload failed: ${uploadRes.status} ${errText}`)
    }
    
    const uploadData = await uploadRes.json()
    console.log('Upload successful! Secure URL:', uploadData.secure_url)
    
    console.log('Saving to /api/media...')
    const saveRes = await fetch(`${API_URL}/api/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: 'test-file.txt',
        url: uploadData.secure_url,
        type: 'document',
        sizeBytes: uploadData.bytes
      })
    })
    
    if (!saveRes.ok) {
      const errText = await saveRes.text()
      throw new Error(`Save API failed: ${saveRes.status} ${errText}`)
    }
    
    const saveData = await saveRes.json()
    console.log('Save successful!', saveData)
    
    console.log('ALL TESTS PASSED!')
    process.exit(0)
  } catch (error) {
    console.error('TEST FAILED:', error)
    process.exit(1)
  }
}

testCloudinary()
