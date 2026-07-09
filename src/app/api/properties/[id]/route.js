import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'

export async function GET(request, { params }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true, slug: true, title: true, description: true, price: true, area: true,
        bedrooms: true, bathrooms: true, address: true, district: true,
        city: true, listingType: true, propertyType: true, promoBadge: true,
        featured: true,
        thumbnail: true,
        images: { select: { id: true, imageUrl: true }, orderBy: { id: 'asc' } },
      }
    })
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(property)
  } catch (error) {
    console.error('GET /api/properties/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    const data = await request.json()
    // Loại bỏ field images vì nó là relation field, không thể update trực tiếp
    const { images, ...updateData } = data
    const updated = await prisma.property.update({
      where: { id: parseInt(params.id) },
      data: updateData
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/properties/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    await prisma.property.delete({ where: { id: parseInt(params.id) } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/properties/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
