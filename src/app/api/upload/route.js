import { NextResponse } from 'next/server'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(request) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const mimeType = file.type || 'image/jpeg'

    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
    }

    // Max 10 MB
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10 MB.' }, { status: 400 })
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Determine extension from mime type
    const extMap = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
    }
    const ext = extMap[mimeType] || '.jpg'

    // Generate unique filename: uuid-timestamp.ext
    const filename = `${randomUUID()}-${Date.now()}${ext}`
    const filepath = path.join(UPLOAD_DIR, filename)

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await writeFile(filepath, buffer)

    // Return public URL path (starts with /uploads/)
    const imageUrl = `/uploads/${filename}`

    return NextResponse.json({
      success: true,
      imageUrl,
      filename,
      mimeType,
      size: buffer.length,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
