import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Đọc file thành ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Convert thành base64
    const base64String = buffer.toString('base64')
    
    // Lấy MIME type
    const mimeType = file.type || 'image/jpeg'
    
    // Kết hợp: data:image/jpeg;base64,<base64data>
    const dataUrl = `data:${mimeType};base64,${base64String}`

    return NextResponse.json({ 
      success: true, 
      image: dataUrl,
      base64: base64String,
      mimeType: mimeType
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
