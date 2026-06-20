import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(request) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token
      }
    },
    pages: {
      signIn: '/admin/login',
      error: '/admin/login'
    }
  }
)

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/dashboard',
    '/admin/properties/:path*',
    '/admin/properties',
    '/admin/projects/:path*',
    '/admin/projects',
    '/admin/articles/:path*',
    '/admin/articles',
    '/admin/contacts/:path*',
    '/admin/contacts',
    '/admin/settings/:path*',
    '/admin/settings',
  ]
}
