import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { id: 'desc' } })
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('GET /api/contacts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const newContact = await prisma.contact.create({ data })
    return NextResponse.json(newContact, { status: 201 })
  } catch (error) {
    console.error('POST /api/contacts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
