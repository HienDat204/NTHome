import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const data = await request.json()
    const { name, email, phone, message } = data

    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ thông tin' }, { status: 400 })
    }

    const newContact = await prisma.contact.create({
      data: {
        name: String(name).trim(),
        email: String(email || '').trim(),
        phone: String(phone).trim(),
        message: String(message).trim(),
      },
    })

    return NextResponse.json(newContact, { status: 201 })
  } catch (error) {
    console.error('POST /api/contacts/public error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
