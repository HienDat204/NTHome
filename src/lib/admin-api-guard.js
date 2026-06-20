import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function requireAdminWriteAccess(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const { pathname } = new URL(referer)
      if (!pathname.startsWith('/admin')) {
        return NextResponse.json(
          { error: 'Write operations are only allowed from admin pages' },
          { status: 403 }
        )
      }
    } catch {
      return NextResponse.json({ error: 'Invalid referer' }, { status: 403 })
    }
  }

  return null
}
