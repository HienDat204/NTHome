import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'

export async function GET(request, { params }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(params.id) },
      include: { images: true }
    })
    if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ...property, price: property.price.toString() })
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
    return NextResponse.json({ ...updated, price: updated.price.toString() })
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
    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/properties/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
