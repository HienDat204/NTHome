import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: 'desc' },
      include: { images: { orderBy: { id: 'asc' } } }
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('GET /api/projects error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    const data = await request.json()
    const newProject = await prisma.project.create({ data })
    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('POST /api/projects error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
