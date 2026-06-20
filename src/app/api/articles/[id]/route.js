import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) }
    })
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(article)
  } catch (error) {
    console.error('GET /api/articles/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    const updated = await prisma.article.update({
      where: { id: parseInt(params.id) },
      data
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/articles/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.article.delete({ where: { id: parseInt(params.id) } })
    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/articles/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
