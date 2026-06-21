import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminWriteAccess } from '@/lib/admin-api-guard'

export async function DELETE(request, { params }) {
  try {
    const deniedResponse = await requireAdminWriteAccess(request)
    if (deniedResponse) return deniedResponse

    const contactId = parseInt(params.id)
    if (Number.isNaN(contactId)) {
      return NextResponse.json({ error: 'Invalid contact id' }, { status: 400 })
    }

    await prisma.contact.delete({ where: { id: contactId } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('DELETE /api/contacts/[id] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
