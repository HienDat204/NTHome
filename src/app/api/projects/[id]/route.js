import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'

export async function GET(request, { params }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(params.id) },
      include: { images: { orderBy: { id: 'asc' } } }
    })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch (error) {
    console.error('GET /api/projects/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    const data = await request.json()
    const updated = await prisma.project.update({
      where: { id: parseInt(params.id) },
      data
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/projects/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    await prisma.project.delete({ where: { id: parseInt(params.id) } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
