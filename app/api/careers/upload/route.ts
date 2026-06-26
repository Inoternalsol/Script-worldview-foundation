import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    
    // Fallback check based on file extension if type is empty/generic
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const isExtensionValid = ['pdf', 'doc', 'docx'].includes(ext)
    const isTypeValid = validTypes.includes(file.type) || (file.type === '' && isExtensionValid)

    if (!isTypeValid && !isExtensionValid) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and Word documents are allowed.' },
        { status: 400 }
      )
    }

    // Validate size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds the 5MB limit.' },
        { status: 400 }
      )
    }

    // Read file data
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save path: public/uploads/cvs/
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'cvs')
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true })

    // Generate safe filename
    const safeFilename = `${nanoid()}.${ext}`
    const filePath = join(uploadDir, safeFilename)

    // Write file to disk
    await writeFile(filePath, buffer)

    // Return absolute URL
    const fileUrl = `${req.nextUrl.origin}/uploads/cvs/${safeFilename}`

    return NextResponse.json({ ok: true, url: fileUrl })
  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    )
  }
}
