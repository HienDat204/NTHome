import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'

export async function GET() {
  try {
    const settings = await prisma.setting.findFirst()
    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('GET /api/settings error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    const data = await request.json()
    const existing = await prisma.setting.findFirst()

    let updated
    if (existing) {
      updated = await prisma.setting.update({
        where: { id: existing.id },
        data,
      })
    } else {
      updated = await prisma.setting.create({ data })
    }
    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/settings error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
