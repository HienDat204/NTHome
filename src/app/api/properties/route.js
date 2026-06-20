import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'

export async function GET() {
  try {
    const raw = await prisma.property.findMany({ 
      include: { images: true },
      orderBy: { createdAt: 'desc' } 
    })
    const properties = raw.map(p => ({ ...p, price: p.price.toString() }))
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
    const newProperty = await prisma.property.create({ data })
    return NextResponse.json({ ...newProperty, price: newProperty.price.toString() }, { status: 201 })
  } catch (error) {
    console.error('POST /api/properties error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
