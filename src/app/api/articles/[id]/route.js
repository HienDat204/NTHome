import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getPrisma() {
  const { default: prisma } = await import('@/lib/prisma')
  return prisma
}

function getArticleId(params) {
  const id = Number.parseInt(params?.id, 10)
  return Number.isNaN(id) ? null : id
}

export async function GET(request, { params }) {
  try {
    const id = await getArticleId(params)
    if (!id) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const prisma = await getPrisma()
    const article = await prisma.article.findUnique({
      where: { id }
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
    const id = await getArticleId(params)
    if (!id) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const data = await request.json()
    const prisma = await getPrisma()
    const updated = await prisma.article.update({
      where: { id },
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
    const id = await getArticleId(params)
    if (!id) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const prisma = await getPrisma()
    await prisma.article.delete({ where: { id } })
    return NextResponse.json(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/articles/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
