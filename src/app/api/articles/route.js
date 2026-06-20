import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({ orderBy: { id: 'desc' } })
    return NextResponse.json(articles)
  } catch (error) {
    console.error('GET /api/articles error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    const data = await request.json()
    const newArticle = await prisma.article.create({ data })
    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    console.error('POST /api/articles error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
