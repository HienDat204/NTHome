import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: { images: { orderBy: { id: 'asc' } } },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(properties)
  } catch (error) {
    console.error('GET /api/properties error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    const data = await request.json()

    // Tách mảng ảnh ra khỏi data chính, thumbnail được đồng bộ tự động từ ảnh đầu tiên
    const { additionalImages = [], thumbnail, ...propertyData } = data
    const normalizedAdditionalImages = additionalImages.filter(Boolean)
    const firstImage = normalizedAdditionalImages[0] || thumbnail

    if (!firstImage) {
      return NextResponse.json({ error: 'Vui lòng tải lên ít nhất 1 ảnh chi tiết' }, { status: 400 })
    }

    // Tạo property với images nếu có
    const createData = {
      ...propertyData,
      thumbnail: firstImage,
      ...(normalizedAdditionalImages.length > 0 && {
        images: {
          create: normalizedAdditionalImages.map(imageUrl => ({ imageUrl }))
        }
      })
    }

    const newProperty = await prisma.property.create({
      data: createData,
      include: { images: { orderBy: { id: 'asc' } } }
    })

    return NextResponse.json(newProperty, { status: 201 })
  } catch (error) {
    console.error('POST /api/properties error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
